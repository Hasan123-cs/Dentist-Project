# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\auth.spec.js >> Authentication Tests >> Protected page redirects without login
- Location: tests\auth.spec.js:77:9

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/dashboard", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { login } from "../helpers/login";
  3   | 
  4   | 
  5   | test.describe("Authentication Tests", () => {
  6   | 
  7   | 
  8   |     test("Doctor can login successfully", async ({ page }) => {
  9   | 
  10  | 
  11  |         await login(page);
  12  | 
  13  | 
  14  |         console.log(
  15  |             "URL AFTER LOGIN:",
  16  |             page.url()
  17  |         );
  18  | 
  19  | 
  20  |         await expect(
  21  |             page.locator("body")
  22  |         )
  23  |             .toContainText(
  24  |                 "Dashboard"
  25  |             );
  26  | 
  27  | 
  28  |     });
  29  | 
  30  | 
  31  | 
  32  |     test("Wrong password should fail", async ({ page }) => {
  33  | 
  34  | 
  35  |         await page.goto(
  36  |             "http://localhost:3000/login"
  37  |         );
  38  | 
  39  | 
  40  |         await page.locator("input").nth(0)
  41  |             .fill(
  42  |                 "Doctor-Amany@clinic.com"
  43  |             );
  44  | 
  45  | 
  46  |         await page.locator("input").nth(1)
  47  |             .fill(
  48  |                 "wrongpassword"
  49  |             );
  50  | 
  51  | 
  52  |         await page.locator("button")
  53  |             .filter({
  54  |                 hasText: "Login"
  55  |             })
  56  |             .click();
  57  | 
  58  | 
  59  |         await page.waitForTimeout(3000);
  60  | 
  61  | 
  62  | 
  63  |         // should stay in login page
  64  |         expect(
  65  |             page.url()
  66  |         )
  67  |             .toContain(
  68  |                 "/login"
  69  |             );
  70  | 
  71  | 
  72  |     });
  73  | 
  74  | 
  75  | 
  76  | 
  77  |     test("Protected page redirects without login", async ({ page }) => {
  78  | 
  79  | 
> 80  |         await page.goto(
      |                    ^ Error: page.goto: Target page, context or browser has been closed
  81  |             "http://localhost:3000/dashboard"
  82  |         );
  83  | 
  84  | 
  85  |         await page.waitForTimeout(3000);
  86  | 
  87  | 
  88  |         expect(
  89  |             page.url()
  90  |         )
  91  |             .toContain(
  92  |                 "login"
  93  |             );
  94  | 
  95  | 
  96  |     });
  97  | 
  98  | 
  99  | 
  100 | });
```