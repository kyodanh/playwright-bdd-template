// Tập trung toàn bộ locators — tránh hardcode selector rải khắp Page Object
// Thêm `as const` để TypeScript giữ đúng literal type cho role (AriaRole)
export function getLocators() {
  return {

    loginLocators: {
      usernameInput: "input[name='username']",
      passwordInput: "input[name='password']",
      loginButton:   { role: 'button' as const, name: 'Đăng nhập' },
      dashboardText: "//h1[normalize-space(text())='Dashboard']",
      errorText:     ".error-message",
    },

    // TODO: Thêm locator cho các module khác tại đây
    // exampleLocators: {
    //   searchInput: "id=search",
    //   submitButton: { role: 'button' as const, name: 'Tìm kiếm' },
    // },

  } as const;
}
