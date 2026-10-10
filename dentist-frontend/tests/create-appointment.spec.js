import { test, expect } from "@playwright/test";
import { login } from "../helpers/login";


test.describe("Create Appointment Tests", () => {


    test.setTimeout(60000);



    test("Doctor can create appointment successfully", async ({ page }) => {



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



        await page.waitForTimeout(3000);





        // ==========================
        // OPEN NEW APPOINTMENT
        // ==========================


        await page.getByText(
            "+ New Appointment",
            {
                exact:false
            }
        )
        .click();



        await page.waitForTimeout(3000);



        console.log(
            "URL:",
            page.url()
        );





        // ==========================
        // PATIENT
        // ==========================


        await page.locator(
            'input[name="patientName"]'
        )
        .fill(
            "hassan jakmra"
        );



        await page.waitForTimeout(500);





        // ==========================
        // TREATMENT
        // ==========================


        await page.locator(
            'input[name="treatmentName"]'
        )
        .fill(
            "filling"
        );



        await page.waitForTimeout(500);





        // ==========================
        // DATE
        // ==========================


        await page.locator(
            'input[name="date"]'
        )
        .fill(
            "2026-10-15"
        );



        await page.waitForTimeout(2000);







        // ==========================
        // START TIME
        // ==========================


        const startTime =
            page.getByRole(
                "group",
                {
                    name:"Start Time"
                }
            );



        await startTime.click();



        await page.waitForTimeout(2000);



        await startTime
            .getByRole(
                "spinbutton",
                {
                    name:"Hours"
                }
            )
            .fill(
                "05"
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
                "PM"
            );



        await page.keyboard.press(
            "Tab"
        );



        await page.waitForTimeout(2000);







        // ==========================
        // END TIME
        // ==========================


        const endTime =
            page.getByRole(
                "group",
                {
                    name:"End Time"
                }
            );



        await endTime.click();



        await page.waitForTimeout(2000);



        await endTime
            .getByRole(
                "spinbutton",
                {
                    name:"Hours"
                }
            )
            .fill(
                "05"
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
                "PM"
            );



        await page.keyboard.press(
            "Tab"
        );



        await page.waitForTimeout(3000);







        // ==========================
        // DEBUG
        // ==========================


        console.log(
            "INPUT VALUES:"
        );


        console.log(

            await page.locator("input")
            .evaluateAll(
                inputs =>
                inputs.map(i=>({
                    name:i.name,
                    type:i.type,
                    value:i.value
                }))
            )

        );




        console.log(
            "BUTTON STATUS:"
        );


        console.log(

            await page.locator("button")
            .evaluateAll(
                buttons =>
                buttons.map((b,i)=>({
                    index:i,
                    text:b.innerText,
                    disabled:b.disabled
                }))
            )

        );







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
            "FINAL URL:",
            page.url()
        );



    });


});