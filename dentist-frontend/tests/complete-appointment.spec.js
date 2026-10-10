import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";


test.describe("Complete Appointment Tests", () => {


    test.setTimeout(90000);



    test("Doctor can create and complete appointment", async ({ page }) => {



        // ==========================
        // LOGIN
        // ==========================


        await login(page);





        // ==========================
        // OPEN APPOINTMENTS
        // ==========================


        await page.getByText(
            "Appointments",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(4000);







        // ==========================
        // NEW APPOINTMENT
        // ==========================


        await page.getByText(
            "+ New Appointment",
            {
                exact:false
            }
        )
        .click();



        await page.waitForTimeout(4000);






        // ==========================
        // FILL PATIENT
        // ==========================


        await page.locator(
            'input[name="patientName"]'
        )
        .fill(
            "hassan"
        );




        // TREATMENT


        await page.locator(
            'input[name="treatmentName"]'
        )
        .fill(
            "filling"
        );




        // DATE


        await page.locator(
            'input[name="date"]'
        )
        .fill(
            "2026-10-15"
        );



        await page.waitForTimeout(2000);







        // ==========================
        // START TIME 10:00 AM
        // ==========================


        const startTime =
            page.getByRole(
                "group",
                {
                    name:"Start Time"
                }
            );



        await startTime.click();



        await startTime
        .getByRole(
            "spinbutton",
            {
                name:"Hours"
            }
        )
        .fill(
            "10"
        );



        await startTime
        .getByRole(
            "spinbutton",
            {
                name:"Minutes"
            }
        )
        .fill(
            "00"
        );



        await startTime
        .getByRole(
            "spinbutton",
            {
                name:"Meridiem"
            }
        )
        .fill(
            "AM"
        );



        await page.keyboard.press(
            "Tab"
        );



        await page.waitForTimeout(2000);







        // ==========================
        // END TIME 10:30 AM
        // ==========================


        const endTime =
            page.getByRole(
                "group",
                {
                    name:"End Time"
                }
            );



        await endTime.click();



        await endTime
        .getByRole(
            "spinbutton",
            {
                name:"Hours"
            }
        )
        .fill(
            "10"
        );



        await endTime
        .getByRole(
            "spinbutton",
            {
                name:"Minutes"
            }
        )
        .fill(
            "30"
        );



        await endTime
        .getByRole(
            "spinbutton",
            {
                name:"Meridiem"
            }
        )
        .fill(
            "AM"
        );



        await page.keyboard.press(
            "Tab"
        );



        await page.waitForTimeout(3000);







        // ==========================
        // SAVE
        // ==========================


        const saveButton =
            page.getByText(
                "SAVE APPOINTMENT",
                {
                    exact:true
                }
            );



        console.log(
            "SAVE ENABLED:",
            await saveButton.isEnabled()
        );



        await expect(
            saveButton
        )
        .toBeEnabled();



        await saveButton.click();



        await page.waitForTimeout(5000);




        console.log(
            "AFTER CREATE:",
            page.url()
        );







        // ==========================
        // BACK TO APPOINTMENTS
        // ==========================


        await page.getByText(
            "← BACK",
            {
                exact:false
            }
        )
        .click();



        await page.waitForTimeout(5000);





        console.log(
            "BACK URL:",
            page.url()
        );







        // ==========================
        // OPEN LATEST APPOINTMENT
        // ==========================


        await page.getByText(
            "Details",
            {
                exact:true
            }
        )
        .last()
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







        // ==========================
        // COMPLETE APPOINTMENT
        // ==========================


        await expect(
            page.getByText(
                "Complete Appointment",
                {
                    exact:true
                }
            )
        )
        .toBeVisible();



        await page.getByText(
            "Complete Appointment",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(3000);







        // ==========================
        // PAYMENT
        // ==========================


        await page.getByLabel(
            "Payment Status"
        )
        .click();



        await page.getByText(
            "Paid",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(2000);




        const amount =
            page.getByLabel(
                "Amount Paid"
            );



        if(
            await amount.isVisible()
        ){

            await amount.fill(
                "10"
            );

        }






        // SAVE COMPLETE


        await page.getByText(
            "Save",
            {
                exact:true
            }
        )
        .click();



        await page.waitForTimeout(7000);







        // VERIFY


        await expect(
            page.getByText(
                "Appointment Completed",
                {
                    exact:true
                }
            )
        )
        .toBeVisible();



    });


});