import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";



test.describe("Dashboard Tests", () => {



    test("Doctor can open dashboard", async ({ page }) => {


        await login(page);



        await expect(
            page.locator("body")
        )
        .toContainText(
            "Dashboard"
        );


    });







    test("Dashboard sidebar appears", async ({ page }) => {


        await login(page);



        const body =
            await page.locator("body").innerText();



        console.log(body);



        expect(body)
            .toContain("Patients");


        expect(body)
            .toContain("Appointments");


        expect(body)
            .toContain("Treatments");


        expect(body)
            .toContain("WhatsApp");



    });







    test("Dashboard loads without crash", async ({ page }) => {


        await login(page);



        await page.waitForTimeout(3000);



        const text =
            await page.locator("body").innerText();



        expect(text.length)
            .toBeGreaterThan(50);



    });



});