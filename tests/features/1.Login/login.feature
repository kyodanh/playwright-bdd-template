Feature: Đăng nhập hệ thống
  Kiểm tra chức năng đăng nhập với các tài khoản hợp lệ và không hợp lệ

  # ----------------------------------------------------------------
  # TC01 — Đăng nhập thành công
  # ----------------------------------------------------------------
  @login @smoke
  Scenario Outline: Đăng nhập thành công với tài khoản hợp lệ
    Given User thực hiện mở web và đăng nhập
      | url   | username   | password   |
      | <url> | <username> | <password> |
    Then Hệ thống chuyển đến màn hình dashboard

    Examples:
      | url                        | username  | password   |
      | https://your-app.com/login | admin     | Admin@123  |

  # ----------------------------------------------------------------
  # TC02 — Đăng nhập thất bại (sai mật khẩu)
  # ----------------------------------------------------------------
  @login @negative
  Scenario Outline: Đăng nhập thất bại với mật khẩu sai
    Given User thực hiện mở web và đăng nhập
      | url   | username   | password   |
      | <url> | <username> | <password> |
    Then Hệ thống hiển thị thông báo lỗi đăng nhập
      | message   |
      | <message> |

    Examples:
      | url                        | username | password  | message                              |
      | https://your-app.com/login | admin    | wrongpass | Tên đăng nhập hoặc mật khẩu không đúng |
