import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";


test.describe("Appointment Details Tests", () => {


    test.setTimeout(60000);



    test("Doctor can open appointment details", async ({ page }) => {



        await login(page);



        // Open appointments page

        await page.getByText(
            "Appointments",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(5000);





        // Click first Details button

        await page.getByText(
            "Details",
            {
                exact:true
            }
        )
        .first()
        .click();



        await page.waitForTimeout(5000);



        console.log(
            "CURRENT URL:",
            page.url()
        );



        expect(
            page.url()
        )
        .toContain(
            "/appointmentDetails/"
        );





        // Check page content


        await expect(
            page.getByText(
                "Appointment Details",
                {
                    exact:true
                }
            )
        )
        .toBeVisible();



        await expect(
            page.getByText(
                "Appointment Information",
                {
                    exact:true
                }
            )
        )
        .toBeVisible();



        await expect(
            page.getByText(
                "Payment Information",
                {
                    exact:true
                }
            )
        )
        .toBeVisible();



    });

});