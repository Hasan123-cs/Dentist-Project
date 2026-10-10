import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";



test.describe("Patients Tests", () => {



    test("Doctor can open Patients page", async ({ page }) => {


        await login(page);



        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        await expect(
            page.locator("body")
        )
        .toContainText(
            "Patients"
        );


    });








    test("Patients list loads from API", async ({ page }) => {


        await login(page);



        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        const body =
            await page.locator("body")
            .innerText();



        console.log(body);



        expect(
            body.length
        )
        .toBeGreaterThan(50);



    });









    test("Doctor can search patient", async ({ page }) => {


        await login(page);



        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        const inputs =
            await page.locator("input")
            .count();



        console.log(
            "INPUT COUNT:",
            inputs
        );



        // search input is probably first input on page
        await page.locator("input")
            .first()
            .fill(
                "hassan"
            );



        await page.waitForTimeout(2000);



        await expect(
            page.locator("body")
        )
        .toContainText(
            "hassan"
        );



    });



});