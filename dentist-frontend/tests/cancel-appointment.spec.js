import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";


test.describe("Cancel Appointment Tests", () => {


    test.setTimeout(60000);



    test("Doctor can cancel appointment", async ({ page }) => {



        await login(page);



        // Open appointments

        await page.getByText(
            "Appointments",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(5000);



        // Open details

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
            "DETAIL URL:",
            page.url()
        );



        expect(
            page.url()
        )
        .toContain(
            "/appointmentDetails/"
        );





        // Handle confirm popup

        page.on(
            "dialog",
            async dialog => {

                console.log(
                    "DIALOG:",
                    dialog.message()
                );


                await dialog.accept();

            }
        );





        // Click cancel

        const cancelButton =
            page.getByText(
                "Cancel Appointment",
                {
                    exact:true
                }
            );



        await expect(
            cancelButton
        )
        .toBeVisible();



        await cancelButton.click();



        await page.waitForTimeout(5000);





        // Check cancelled status


        await expect(
            page.getByText(
                "Appointment Cancelled",
                {
                    exact:true
                }
            )
        )
        .toBeVisible();



    });



});