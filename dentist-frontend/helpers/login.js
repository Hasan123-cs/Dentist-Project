export async function login(page) {

    await page.goto("http://localhost:3000/login");


    await page.waitForTimeout(2000);


    console.log(
        "INPUTS:",
        await page.locator("input").evaluateAll(inputs =>
            inputs.map(i => ({
                type: i.type,
                placeholder: i.placeholder,
                value: i.value
            }))
        )
    );


    // Email input
    await page.locator("input").nth(0)
        .fill("Doctor-Amany@clinic.com");


    // Password input
    await page.locator("input").nth(1)
        .fill("Amany@123");


    console.log("FILLED INPUTS");


    await page.waitForTimeout(1000);


    // Click login
    await page.locator("button")
        .filter({
            hasText: "Login"
        })
        .click();


    console.log("LOGIN CLICKED");


    await page.waitForTimeout(5000);


    console.log(
        "CURRENT URL:",
        page.url()
    );

}