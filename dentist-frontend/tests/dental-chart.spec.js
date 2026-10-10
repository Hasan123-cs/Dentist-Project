import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";


test.describe("Dental Chart Tests", () => {


    test.setTimeout(90000);



    test("Doctor can open dental chart and update tooth", async ({ page }) => {



        // ==========================
        // LOGIN
        // ==========================


        await login(page);






        // ==========================
        // OPEN PATIENTS
        // ==========================


        await page.getByText(
            "Patients",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(5000);







        // ==========================
        // OPEN PATIENT PROFILE
        // ==========================


        await page.getByText(
            "VIEW PATIENT PROFILE",
            {
                exact:true
            }
        )
        .first()
        .click();



        await page.waitForTimeout(5000);



        console.log(
            "PROFILE:",
            page.url()
        );







        // ==========================
        // OPEN DENTAL CHART
        // ==========================


        await page.getByRole(
            "tab",
            {
                name:"Dental Chart"
            }
        )
        .click();



        await page.waitForTimeout(5000);



        console.log(
            "DENTAL TAB OPENED"
        );







        // ==========================
        // VERIFY TAB ACTIVE
        // ==========================


        await expect(
            page.getByRole(
                "tab",
                {
                    name:"Dental Chart"
                }
            )
        )
        .toHaveAttribute(
            "aria-selected",
            "true"
        );







        // ==========================
        // SELECT TOOTH 18
        // ==========================


        const toothNumber =
            page.getByText(
                "18",
                {
                    exact:true
                }
            );



        await expect(
            toothNumber
        )
        .toBeVisible();



        console.log(
            "TOOTH FOUND"
        );



        // click Tooth parent (the Box with onClick)

        const tooth =
            toothNumber.locator(
                "xpath=ancestor::div[@class='MuiBox-root'][1]"
            );



        await tooth.click({
            force:true
        });



        await page.waitForTimeout(3000);



        console.log(
            "TOOTH CLICKED"
        );







        // ==========================
        // VERIFY SELECTED TOOTH
        // ==========================


        await expect(
            page.getByText(
                "Selected Tooth: 18",
                {
                    exact:false
                }
            )
        )
        .toBeVisible();



        console.log(
            "TOOTH SELECTED"
        );








        // ==========================
        // SELECT SURFACE O
        // ==========================


        await page.getByRole(
            "button",
            {
                name:"O"
            }
        )
        .click();



        await page.waitForTimeout(1000);







        // ==========================
        // APPLY FILLING
        // ==========================


        await page.getByRole(
            "button",
            {
                name:"Filling"
            }
        )
        .click();



        await page.waitForTimeout(7000);



        console.log(
            "FILLING APPLIED"
        );



    });


});