import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";



test.describe("Appointments Tests", () => {



    test("Doctor can open appointments page", async ({page})=>{


        await login(page);



        await page.getByText(
            "Appointments",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(4000);



        await expect(
            page.locator("body")
        )
        .toContainText(
            "Appointments"
        );



    });








    test("Appointments calendar loads", async ({page})=>{


        await login(page);



        await page.getByText(
            "Appointments",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(5000);



        const body =
            await page.locator("body")
            .innerText();



        console.log(body);



        expect(
            body.length
        )
        .toBeGreaterThan(100);



    });








    test("Appointments shows existing appointment data", async ({page})=>{


        await login(page);



        await page.getByText(
            "Appointments",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(5000);



        const body =
            await page.locator("body")
            .innerText();



        // based on your dashboard data
        // we expect appointment information


        expect(
            body
        )
        .toMatch(
            /Pending|Completed|Cancelled|Scheduled/i
        );



    });



});