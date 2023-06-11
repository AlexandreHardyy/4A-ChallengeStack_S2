<script lang="ts" setup></script>

<template>
  <div>
    <header
      class="tw-flex tw-justify-between tw-h-16 tw-p-2 tw-bg-primary-light"
    >
      <div class="tw-flex tw-gap-16">
        <img src="~/assets/logo_black.png" class="tw-h-full" alt="logo" />
        <nav>
          <ul class="tw-flex tw-h-full tw-items-center tw-gap-5">
            <li>
              <nuxt-link class="btn" :to="{ path: '/' }">Home</nuxt-link>
            </li>
            <li>
              <nuxt-link class="btn" :to="{ path: '/', hash: '#services' }"
                >Services</nuxt-link
              >
            </li>
            <li>
              <nuxt-link class="btn" :to="{ path: '/', hash: '#about' }"
                >About</nuxt-link
              >
            </li>
            <li>
              <nuxt-link class="btn" :to="{ path: '/', hash: '#contact' }"
                >Contact</nuxt-link
              >
            </li>
          </ul>
        </nav>
      </div>
      <div class="login-section tw-flex tw-items-center tw-gap-5">
        <NuxtLink to="/register" class="btn">REGISTER</NuxtLink>
        <NuxtLink to="/login" class="btn">LOGIN</NuxtLink>
      </div>
    </header>
    <slot />
    <footer
      class="tw-h-20 tw-bg-grey-light tw-flex tw-flex-col tw-items-center tw-justify-center tw-mt-20"
    >
      <div>2023 - 2024 | Copyright | PAYGATE, All rights reserved</div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  color: theme("colors.background");
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-bottom: 4px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    border-bottom: 4px solid theme("colors.background");
  }
}
</style>
