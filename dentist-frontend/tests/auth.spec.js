import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";


test.describe("Authentication Tests", () => {


    test("Doctor can login successfully", async ({ page }) => {


        await login(page);


        console.log(
            "URL AFTER LOGIN:",
            page.url()
        );


        await expect(
            page.locator("body")
        )
            .toContainText(
                "Dashboard"
            );


    });



    test("Wrong password should fail", async ({ page }) => {


        await page.goto(
            "http://localhost:3000/login"
        );


        await page.locator("input").nth(0)
            .fill(
                "Doctor-Amany@clinic.com"
            );


        await page.locator("input").nth(1)
            .fill(
                "wrongpassword"
            );


        await page.locator("button")
            .filter({
                hasText: "Login"
            })
            .click();


        await page.waitForTimeout(3000);



        // should stay in login page
        expect(
            page.url()
        )
            .toContain(
                "/login"
            );


    });




    test("Protected page redirects without login", async ({ page }) => {


        await page.goto(
            "http://localhost:3000/dashboard"
        );


        await page.waitForTimeout(3000);


        expect(
            page.url()
        )
            .toContain(
                "login"
            );


    });



});