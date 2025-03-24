/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by vite-plugin-uni-pages

interface NavigateToOptions {
  url: "/pages/wot/wot" |
       "/pages/waterfall/waterfall" |
       "/pages/index/index" |
       "/pages/about/about" |
       "/pages/echarts/echarts1" |
       "/pages/echarts/echarts2" |
       "/pages/test/test" |
       "/pages/test/test2" |
       "/pages/wot/issue/borderNoShow" |
       "/pages/wot/issue/pickerViewIssue" |
       "/pages/wot/issue/wdDatetimePicker" |
       "/pages/wot/issue/wdTabsIssue";
}
interface RedirectToOptions extends NavigateToOptions {}

interface SwitchTabOptions {
  url: "/pages/index/index" | "/pages/wot/wot" | "/pages/test/test" | "/pages/waterfall/waterfall" | "/pages/about/about"
}

type ReLaunchOptions = NavigateToOptions | SwitchTabOptions;

declare interface Uni {
  navigateTo(options: UniNamespace.NavigateToOptions & NavigateToOptions): void;
  redirectTo(options: UniNamespace.RedirectToOptions & RedirectToOptions): void;
  switchTab(options: UniNamespace.SwitchTabOptions & SwitchTabOptions): void;
  reLaunch(options: UniNamespace.ReLaunchOptions & ReLaunchOptions): void;
}
