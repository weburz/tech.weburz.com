<script setup lang="ts">
useSeoMeta({
  title: "Careers",
  ogTitle: "Careers",
  description:
    "We're not hiring right now. The inbox is open if you'd like to be on our radar for next time.",
  ogDescription:
    "We're not hiring right now. The inbox is open if you'd like to be on our radar for next time.",
});

defineOgImage("Docs", {
  title: "Careers",
  description:
    "We're not hiring right now. The inbox is open if you'd like to be on our radar for next time.",
});
</script>

<template>
  <UContainer class="py-12 sm:py-20">
    <div class="max-w-2xl">
      <p class="text-xs uppercase tracking-wider text-muted">Careers</p>
      <h1 class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
        Role not found.
      </h1>

      <div
        class="mt-8 rounded-lg border border-default bg-elevated/50 overflow-hidden font-mono text-sm"
      >
        <div
          class="flex items-center gap-2 px-4 py-2 bg-elevated border-b border-default"
        >
          <span class="size-3 rounded-full bg-red-400/70" />
          <span class="size-3 rounded-full bg-amber-300/80" />
          <span class="size-3 rounded-full bg-green-400/70" />
          <span class="ml-2 text-xs text-muted">weburz — careers</span>
        </div>
        <pre
          class="px-4 py-4 leading-relaxed text-default whitespace-pre-wrap"
        ><span class="text-muted">$</span> ls -la open-roles/
<span class="text-muted">ls: cannot access 'open-roles/': No such file or directory</span>
<span class="text-muted">$</span> <span class="text-muted"># not hiring right now — but the inbox is open.</span>
<span class="text-muted">$</span> <span class="inline-block w-2 h-4 bg-default/70 align-middle animate-pulse" /></pre>
      </div>

      <div class="mt-8 space-y-4 text-default">
        <p>
          Straight answer: <strong>we're not hiring right now.</strong> Weburz
          is small and we don't open roles on a fixed cadence — they show up
          when a project needs them.
        </p>
        <p>
          If you'd like to be on our radar for the next one, send a note with a
          link to something you've built, broken, or written. We're not
          collecting resumes for a list — we'll just read what you sent and
          remember you when something fits.
        </p>
      </div>

      <div class="mt-6">
        <UButton
          to="mailto:contact@weburz.com"
          icon="i-lucide-mail"
          color="neutral"
          variant="outline"
          size="lg"
          label="contact@weburz.com"
        />
      </div>
    </div>

    <figure class="mt-14 sm:mt-20">
      <NuxtImg
        src="/blog/vitosha.webp"
        alt="Sunset over a sea of clouds, seen from the snowy slopes of Vitosha mountain"
        width="2000"
        height="600"
        fit="cover"
        format="webp"
        quality="75"
        loading="lazy"
        class="w-full aspect-[10/3] object-cover rounded-lg"
      />
      <figcaption class="mt-3 text-xs text-muted">
        Vitosha, above Sofia. No open roles today — the mountain isn't going
        anywhere, and neither are we.
      </figcaption>
    </figure>
  </UContainer>
</template>
