Feature: Đăng nhập hệ thống
  Kiểm tra chức năng đăng nhập với các tài khoản hợp lệ và không hợp lệ

  # ----------------------------------------------------------------
  # TC01 — Đăng nhập thành công (tài khoản đơn lẻ từ config)
  # ----------------------------------------------------------------
  @login @smoke
  Scenario: Đăng nhập thành công với tài khoản hợp lệ
    Given User đăng nhập với tài khoản "admin"
    Then Hệ thống chuyển đến màn hình dashboard

  # ----------------------------------------------------------------
  # TC02 — Đăng nhập nhiều tài khoản hợp lệ (data từ CSV)
  # Khai báo file CSV + các cột cần dùng trong bảng
  # ----------------------------------------------------------------
  @login @smoke @csv
  Scenario: Đăng nhập nhiều tài khoản từ CSV
    Then Tất cả tài khoản trong file CSV đăng nhập thành công
      | file                  | columns           |
      | login/login_valid.csv | username,password |

  # ----------------------------------------------------------------
  # TC03 — Đăng nhập thất bại nhiều trường hợp (data từ CSV)
  # ----------------------------------------------------------------
  @login @negative @csv
  Scenario: Đăng nhập thất bại với dữ liệu sai từ CSV
    Then Tất cả tài khoản trong file CSV bị từ chối với lỗi tương ứng
      | file                    | columns                         |
      | login/login_invalid.csv | username,password,error_message |

  # ----------------------------------------------------------------
  # TC04 — Đăng nhập thành công (Outline + Examples từ CSV)
  # Sửa data → chỉnh login_valid.csv, chạy "npm run bddgen" để sync
  # ----------------------------------------------------------------
  @login @smoke @outline
  Scenario Outline: Đăng nhập thành công với tài khoản <username>
    Given User đăng nhập thử với username "<username>" và password "<password>"
    Then Hệ thống chuyển đến màn hình dashboard

    Examples: # @csv:login/login_valid.csv cols:username,password
      | username | password    |
      | admin    | Admin@123   |
      | manager  | Manager@123 |
      | viewer   | Viewer@123  |

  # ----------------------------------------------------------------
  # TC05 — Đăng nhập thất bại (Outline + Examples từ CSV)
  # ----------------------------------------------------------------
  @login @negative @outline
  Scenario Outline: Đăng nhập thất bại — <case>
    Given User đăng nhập thử với username "<username>" và password "<password>"
    Then Hệ thống hiển thị thông báo lỗi "<error_message>"

    Examples: # @csv:login/login_invalid.csv cols:case,username,password,error_message
      | case                    | username | password  | error_message                          |
      | sai mật khẩu            | admin    | wrongpass | Tên đăng nhập hoặc mật khẩu không đúng |
      | mật khẩu trống          | admin    |           | Vui lòng nhập mật khẩu                 |
      | tài khoản trống         |          | Admin@123 | Vui lòng nhập tên đăng nhập            |
      | tài khoản không tồn tại | hacker   | hack123   | Tài khoản không tồn tại                |
