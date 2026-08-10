---
title:
  "Securely Self-Hosting PostgreSQL: Configuration, Backups, and Best Practices"
description:
  Take full control of your data by setting up your own self-hosted PostgreSQL
  database. Discover how to configure, secure, and manage production-ready
  instances efficiently.
date: 2026-08-10 10:04:03.664634+00:00
author: Somraj Saha
category: Infrastructure
cover: /blog/self-hosting-postgresql.webp
---

At [Weburz](https://weburz.com), we've felt the pinch that many growing tech
companies experience: managed database bills that start small, but scale into a
heavy, recurring expense for marginal operational benefits. As our
infrastructure needs grew, relying exclusively on third-party cloud providers
stopped making financial sense.

At the same time, we frequently ran into a wall of fear online. Spend five
minutes browsing tech forums, and database administration is painted as a
terrifying, high-stakes tightrope walk. You'll read endless horror stories about
catastrophic downtime, misconfigured nodes, and nightmare recovery scenarios.
But our experience at Weburz proved otherwise: if done right, maintaining a
self-hosted [PostgreSQL](https://www.postgresql.com) server is not nearly as
scary as the internet portrays it to be. With the right blueprints, automation,
and best practices, it is entirely manageable.

Of course, moving away from a managed environment also meant tackling valid
privacy and security concerns. We couldn't just throw a database onto the public
internet and hope for the best. To solve this, we locked down our infrastructure
by hosting it safely behind robust on-premise firewalls and modern zero-trust
networking tools like [Tailscale](https://tailscale.com), giving us total peace
of mind over our data perimeter.

In this article, we are pulling back the curtain on how we solved these exact
challenges at Weburz. Follow along as we share our comprehensive, step-by-step
guidelines on how we successfully self-host our PostgreSQL database
server-cutting costs, reclaiming control, and keeping our data secure.

## Prerequisites and Infrastructure Requirements

Before we dive into the installation commands, we need to lay a solid
foundation. At Weburz, we learned early on that skipping proper infrastructure
planning leads to performance bottlenecks later. Because our infrastructure runs
on Microsoft Azure, setting up our self-hosted PostgreSQL server starts with
selecting the right Azure Virtual Machine (VM) size, storage tier, and
configuring Azure networking correctly.

Here is the exact Azure infrastructure blueprint we use to get started:

### 1. Azure VM Sizing and Hardware Considerations

PostgreSQL is notoriously efficient, but its performance heavily depends on your
underlying hardware-especially memory and disk throughput. When provisioning an
Azure VM, we recommend:

- Series Selection: Use General Purpose (e.g., Dv5 or Dasv5-series) or Memory
  Optimized (e.g., Ev5-series) VMs. Memory-optimized instances are fantastic
  because PostgreSQL relies heavily on caching data in RAM (`shared_buffers`),
  which directly speeds up query execution.

- vCPUs and RAM: A 2 vCPU / 8 GB RAM instance is a great starting point for
  standard workloads, but scale this up as your concurrent connections and
  dataset grow.

### 2. Azure Managed Disks (Storage is Crucial)

Database operations involve frequent random reads and writes, meaning slow disks
will instantly bottleneck your application.

- Avoid Standard HDDs: Do not use Standard HDD storage for a production
  database.

- Premium SSDs / Ultra Disks: We strictly use Azure Premium SSDs (or Ultra Disks
  for heavy I/O workloads) to ensure high IOPS (Input/Output Operations Per
  Second) and low latency. Enabling Host Caching (Read-only for data disks) can
  also significantly improve read performance.

### 3. Operating System Choice

For consistency, stability, and long-term support, we standardize on Debian
Stable. [Debian](https://www.debian.org) provides rock-solid reliability, and
its package managers (`apt`) make installing and patching PostgreSQL seamless.

To maintain strict environment consistency across our infrastructure at Weburz,
we use [HashiCorp Packer](https://developer.hashicorp.com/packer) to build
standardized "golden images" running on Debian. This ensures every database
instance we spin up is pre-configured identically, drastically reducing
configuration drift.

**NOTE**: Because diving deep into Packer requires a guide of its own, we will
be covering our automated image-building pipeline in detail in an upcoming blog
post!

### 4. Azure Networking and Security Integration

At Weburz, we never expose our database server directly to the public internet.
Instead, we lock down our network architecture within Azure:

- Virtual Network (VNet) & Subnets: Deploy your PostgreSQL VM within a private
  subnet inside an Azure VNet, keeping it entirely isolated from external
  inbound traffic.

- Network Security Groups (NSGs): Configure your NSG rules to block all inbound
  traffic by default, only allowing explicitly trusted internal IPs or
  application subnets.

- Tailscale Integration: To connect our distributed application servers securely
  to this private Azure VM without complex VPN gateways or peering overhead, we
  install Tailscale. This routes all database traffic through an encrypted,
  zero-trust tunnel, ensuring absolute privacy whether our apps are running in
  other Azure regions, AWS, or on-premise.

With your Azure VM provisioned, storage optimized, and network secured, you are
ready for the next step: installing and bootstrapping PostgreSQL.

## Installing PostgreSQL on Your Server

With our Azure infrastructure and operating system foundation locked in, it is
time to get PostgreSQL up and running. At Weburz, we prefer a clean, native
installation using the official PostgreSQL Global Development Group (PGDG) `apt`
repository rather than default OS package repositories. This ensures we get the
latest stable, performance-optimised versions of PostgreSQL directly from the
maintainers.

Here is th step-by-step process we follow to install PostgreSQL on our Debian
golden images:

### 1. Import the Official PostgreSQL Repository

First, update your local package list and install the necessary prerequisites to
securely fetch packages:

```bash
sudo apt-get update
sudo apt-get install --assume-yes curl ca-certificates gnupg
```

Next, import the official PostgreSQL signing key and add the repository to your
system's sources list:

```bash
sudo install --directory /etc/apt/keyrings
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  | sudo gpg --dearmor --output /etc/apt/keyrings/postgresql.gpg
echo "deb [signed-by=/etc/apt/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
  | sudo tee /etc/apt/sources.list.d/pgdg.list
```

### 2. Install PostgreSQL

Once the repository is registered, update your package list again and install
your desired PostgreSQL version (for example, version 19):

```bash
sudo apt-get update
sudo apt-get install --assume-yes postgresql-19 postgresql-contrib-19
```

**TIP**: If you want to future-proof your installation or let the system pull
the absolute latest stable version automatically, you can substitute
`postgresql-16` with just `postgresql`.

### 3. Verify the Installation

By default, the installer automatically initializes a default database cluster
and starts the PostgreSQL service as a `systemd` daemon. You can verify that the
service is running smoothly with:

```bash
sudo systemctl status postgresql
```

You should see an active (`running`) status confirming that your server is
operational.

### 4. Setting the Default Superuser Password

Out of the box, PostgreSQL creates a default superuser account named `postgres`
that relies on peer authentication (meaning it authenticates based on your
system user). To prepare our server for remote application connectivity and
administrative tasks, we set a secure password for this account.

Switch to the `postgres` system user:

```bash
sudo -i -u postgres
```

Access the PostgreSQL interactive terminal (using the `psql` client):

```bash
psql
```

Run the following SQL commands to set a strorng password (replace
`your_secure_password_here` with a robust generated password):

```sql
ALTER USER postgres PASSWORD 'your_secure_password_here';
```

Exit the `psql` prompt by typing `\q`, and return to your regular user shell by
typing `exit`.

With PostgreSQL installed and the primary superuser secured, your are ready for
the next step: configuring users, databases and establishing secure remote
connectivity.

## Initial Configuration and User Management

Now that PostgreSQL is up and running on your Azure VM, the next step is moving
away from the default administrative setup. At Weburz, we follow the principle
of least privilege-meaning we avoid using the master `postgres` superuser for
day-to-day application connections. Instead, we create dedicated databases and
restricted users tailored to each application.

Here is how we handle initial configuration and user management:

### 1. Accessing the PostgreSQL Prompt

To create databases and users, you first need to access the database management
interface. Switch back to the system `postgres` user and launch the interactive
terminal:

```bash
sudo -i -u postgres psql
```

### 2. Creating a Dedicated Database

Instead of cluttering the default `postgres` database, create a dedicated
database for your project. Run the following SQL command (replace `lorem` with
your actual project name):

```sql
CREATE DATABASE weburz_prod;
```

### 3. Creating a Dedicated User and Assigning Privileges

Next, create a non-superuser account for your application. This limits potential
security risks if your application credentials are ever compromised.

Run the following commands to create a user and grant them full ownership and
privileges over your new database:

```sql
CREATE USER john_doe WITH ENCRYPTED PASSWORD 'your_strong_app_password';
GRANT ALL PRIVILEGES ON DATABASE lorem TO john_doe;
```

If you are using PostgreSQL 15 or newer, permission structures have been
tightened. You should also grant privileges on the default `public` schema
within your database so the application can create tables:

```sql
\c lorem
GRANT ALL ON SCHEMA public TO lorem;
```

Type `\q` to exit the `psql` shell, and exit to return to your normal user
account.

### 4. Tuning Basic Resource Configurations

Before opening your database up to the network, it is a good idea to adjust a
few basic settings in the main configuration file, `postgresql.conf`. This file
is typically located at `/etc/postgresql/<VERSION>/main/postgresql.conf`
(depending on your version).

Open the configuration file with your preferred text editor:

```console
sudo vim /etc/postgresql/<VERSION>/main/postgresql.conf
```

Look for the following core parameters to tweak for baseline performance:

- `max_connections`: Default is usually 100. If you have many microservices or
  serverless functions connecting, you might need to adjust this, but keep it
  balanced to prevent exhausting your RAM.

- `shared_buffers`: As a rule of thumb for dedicated database servers, set this
  to roughly 25% of your Azure VM's total RAM to optimize caching.

Save and close the file, then restart PostgreSQL to apply your configuration
changes:

```bash
sudo systemctl restart postgresql
```

## Enabling Remote Access and Network Security

By default, PostgreSQL is locked down to accept connections only from
`localhost`. This is great for security out of the box, but at some point, your
backend application servers-living on different nodes or cloud environments-need
to talk to the database.

At Weburz, we enable remote access without compromising our perimeter security
by combining PostgreSQL's native configuration files with our Tailscale
zero-trust network.

Here is how we configure safe, encrypted remote access:

### 1. Update `listen_addresses` in `postgresql.conf`

First, we need to tell PostgreSQL to listen for incoming connections beyond just
the local machine.

Open your configuration file:

```console
sudo vim /etc/postgresql/<VERSION>/main/postgresql.conf
```

Find the line that controls `listen_addresses`. By default, it is commented out
or set to `localhost`. Change it to listen on all interfaces (`*`) or
specifically on your server's internal Tailscale IP address:

```conf
listen_addresses = '*'
```

**NOTE**: Setting this to `*` is safe only because we will strictly restrict who
can connect using the firewall and authentication files next.

Save and close the file.

### 2. Configure Client Authentication in `pg_hba.conf`

PostgreSQL uses the `pg_hba.conf` (Host-Based Authentication) file to control
which clients are allowed to connect, to which databases, and using what
authentication methods.

```console
sudo vim /etc/postgresql/<VERSION>/main/pg_hba.conf
```

Scroll to the bottom of the file where IPv4 and IPv6 connections are defined.
Instead of allowing connections from anywhere, we want to explicitly whitelist
our application servers or our secure Tailscale IP range (Tailscale typically
uses the `100.64.0.0/10` CGNAT block).

Add a rule like this:

```text
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    lorem           john_doe        100.64.0.0/10           scram-sha-256
```

- `host`: Specifies a network TCP/IP connection.
- `lorem`: The specific database name.
- `john_doe`: The specific application user.
- `100.64.0.0/10`: The Tailscale secure subnet (you can also specify exact
  individual server IP addresses here for tighter security).
- `scram-sha-256`: The modern, secure password-hashing standard used by current
  PostgreSQL versions.

Save and close the file.

### 3. Enforce Azure Network Security Groups (NSGs)

Because our database VM lives in Azure, defense-in-depth is critical. Even
though PostgreSQL is now configured to accept connections via Tailscale, we
ensure that Azure Network Security Groups (NSGs) block standard public inbound
traffic on port `5432`.

- Ensure there are no inbound rules allowing port `5432` from `Any` or
  `Internet`.

- If your application and database are both part of the same Azure Virtual
  Network (VNet) or connected via Tailscale, internal routing handles the
  handshake safely without ever opening ports to the public internet.

### 4. Apply Changes

Restart PostgreSQL to load your new network and authentication rules:

```bash
sudo systemctl restart postgresql
```

With remote access securely established over your private mesh network, your
database is ready for production traffic. Next, let's look at how we harden
security further and manage routine maintenance.

## Hardening Security and User Authentication

Getting your remote connection up and running is a major milestone, but at
Weburz, we treat network-level isolation as only the first line of defense. A
truly production-ready database requires deep-layer security hardening to
protect your data against unauthorized access, credential leaks, and
interception.

Here is how we lock down our self-hosted PostgreSQL instances:

### 1. Enforcing Strong Password Policies and SCRAM-SHA-256

Older versions of PostgreSQL defaulted to the legacy `md5` password-hashing
algorithm, which is susceptible to brute-force attacks if intercepted. Modern
versions default to SCRAM-SHA-256, a much stronger challenge-response
authentication mechanism.

To ensure all database users utilize this robust standard, verify your
`password_encryption` setting inside your `postgresql.conf` file:

```text
password_encryption  = scram-sha-256
```

Whenever you create new database users or rotate existing passwords, PostgreSQL
will automatically hash them securely using SCRAM.

### 2. Implementing the Principle of Least Privilege

We touched on this during user setup, but it bears repeating as a core hardening
practice: **never let your application connect as the superuser (`postgres`)**.

- Restrict your application user (`john_doe`) so it only has permissions on the
  specific schemas and tables it needs.

- Revoke public schema access from unprivileged users if they don't need to
  create objects there:

```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
```

- Regularly audit your user roles and permissions using `psql` commands like
  `\du` to ensure no lingering test accounts or overly permissive roles exist in
  production.

### 3. Encrypting Data in Transit with SSL/TLS

Even though our traffic travels securely over our Tailscale mesh network,
defense-in-depth dictates that all data moving between your application and the
database should be encrypted.

PostgreSQL supports native SSL/TLS connections out of the box. To enforce
encrypted connections:

1. Open your `postgresql.conf` file:

   ```console
   sudo vim /etc/postgresql/<VERSION>/main/postgresql.conf
   ```

2. Locate and enable the SSL parameter:

   ```text
   ssl = on
   ```

3. Point PostgreSQL to your SSL certificate and private key files (you can
   generate self-signed certificates for internal use or provision them via
   Let's Encrypt/internal CA):

   ```text
   ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
   ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'
   ```

To strictly force all clients to use encrypted connections, update your
`pg_hba.conf` file, replacing `host` with `hostssl` for your connection rules:

```text
hostssl lorem john_doe 100.64.0.0/10 scram-sha-256
```

Save your changes and restart PostgreSQL one final time to enforce SSL:

```bash
sudo systemctl restart postgresql
```

With your database fully hardened against threats, secure authentication
enforced, and encrypted channels established, your server is safe and ready. In
our final section, we will look at how we automate backups and monitor
performance to keep things running smoothly.

## Setting Up Automated Backups and Monitoring

Even the most secure and well-optimized database server is vulnerable to the
unexpected-whether it is human error (like an accidental `DROP TABLE` in
production), hardware failure, or silent data corruption. At Weburz, we operate
under a simple rule: **if it isn't backed up automatically, it doesn't exist**.

Here is how we set up a robust backup and monitoring routine for our self-hosted
PostgreSQL instances:

### 1. Automated Logical Backups with `pg_dump`

For routine, lightweight backups, PostgreSQL provides the built-in utility
`pg_dump`. We use a simple shell script combined with `systemd` timers to export
our databases daily.

A basic backup command looks like this:

```bash
pg_dump -U postgres -d lorem -F c -b -v -f /var/backups/postgresql/lorem_prod_$(date +%F).dump
```

- `-F c`: Outputs a custom archive format, which is compressed and allows
  flexible restoration using `pg_restore`.

- `-b`: Includes large objects in the dump.

### 2. Secure Offsite Storage with Restic

Local backups stored on the same Azure VM won't save you if the entire disk or
region suffers a catastrophic failure. To protect against this, we push our
encrypted database dumps to secure offsite cloud storage.

While a deep dive into our disaster recovery pipeline is coming in a future
dedicated blog post, we rely heavily on [Restic](https://restic.net)-a fast,
secure, and incredibly efficient backup program-to handle deduplicated,
encrypted offsite snapshots of our backup directories. It keeps our historical
backups safe without ballooning our storage costs.

### 3. Monitoring Database Performance and Health

You cannot manage what you do not measure. To keep an eye on CPU usage, memory
pressure, disk I/O, and active connections on our Azure VM, we implement
lightweight monitoring tools:

- Node Exporter & Prometheus / Grafana: To track system-level metrics and
  visualize trends over time.

- PostgreSQL Activity Queries: For quick health checks, you can always jump into
  `psql` and check active queries to spot performance bottlenecks or locked
  tables:

  ```sql
  SELECT pid, usename, query, state, age(clock_timestamp(), query_start) AS duration
  FROM pg_stat_activity
  WHERE state != 'idle';
  ```

## Conclusion

Self-hosting your own PostgreSQL database server doesn't have to be a leap into
the unknown. By combining the right Azure infrastructure, a secure zero-trust
network like Tailscale, and automated maintenance workflows, you can cut down on
expensive cloud bills while retaining absolute control over your company's data.

At Weburz, making this switch has given us both peace of mind and financial
freedom-and with this guide, you have the exact blueprint to do it yourself!
