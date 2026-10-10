import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";



test.describe("Patient Actions Tests", () => {



    test("Doctor can open Add Patient page", async ({page})=>{


        await login(page);



        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        await page.getByText(
            "Add Patient",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        expect(
            page.url()
        )
        .toContain(
            "/patients/add"
        );



    });









    test("Doctor can open patient profile", async ({page})=>{


        await login(page);



        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        const profileButtons =
            page.getByText(
                "VIEW PATIENT PROFILE",
                {
                    exact:true
                }
            );



        await expect(
            profileButtons.first()
        )
        .toBeVisible();



        await profileButtons.first()
        .click();



        await page.waitForTimeout(3000);



        console.log(
            "PROFILE URL:",
            page.url()
        );



        expect(
            page.url()
        )
        .toMatch(
            /\/patients\/\d+/
        );



    });









    test("Patient profile loads information", async ({page})=>{


        await login(page);



        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);



        await page.getByText(
            "VIEW PATIENT PROFILE",
            {
                exact:true
            }
        )
        .first()
        .click();



        await page.waitForTimeout(4000);



        const body =
            await page.locator("body")
            .innerText();



        console.log(body);



        expect(
            body.length
        )
        .toBeGreaterThan(50);



    });



});