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

    dashboardLocators: {
      pageTitle:      "h1",
      userMenuButton: { role: 'button' as const, name: 'Tài khoản' },
      logoutButton:   { role: 'menuitem' as const, name: 'Đăng xuất' },
      welcomeText:    ".welcome-message",
    },

  } as const;
}
