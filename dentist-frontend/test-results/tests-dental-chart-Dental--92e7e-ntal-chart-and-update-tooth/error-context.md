# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\dental-chart.spec.js >> Dental Chart Tests >> Doctor can open dental chart and update tooth
- Location: tests\dental-chart.spec.js:14:9

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.click: Test timeout of 90000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Filling', exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]: 🦷
        - generic [ref=e8]:
          - paragraph [ref=e9]: DentalCare
          - paragraph [ref=e10]: Clinic Management
      - generic [ref=e14]:
        - paragraph [ref=e15]: Dr. Amany Nseif
        - paragraph [ref=e16]: Dentist
      - list [ref=e17]:
        - button "Dashboard" [ref=e18] [cursor=pointer]
        - button "Appointments" [ref=e24] [cursor=pointer]
        - button "Patients" [ref=e30] [cursor=pointer]
        - button "Treatments" [ref=e36] [cursor=pointer]
        - button "WhatsApp" [ref=e42] [cursor=pointer]
      - button "Logout" [ref=e48] [cursor=pointer]
    - main [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e57]:
          - generic [ref=e58]:
            - generic [ref=e59]: HA
            - generic [ref=e60]:
              - paragraph [ref=e61]: hassan jakmara
              - generic [ref=e62]: Active Patient
              - paragraph [ref=e64]: "Patient ID #25"
          - button "BACK" [ref=e66] [cursor=pointer]
        - tablist [ref=e70]:
          - tab "Overview" [ref=e71] [cursor=pointer]
          - tab "Dental Chart" [selected] [ref=e72] [cursor=pointer]
          - tab "Treatment Plan" [ref=e73] [cursor=pointer]
          - tab "Images" [ref=e74] [cursor=pointer]
        - generic [ref=e76]:
          - paragraph [ref=e77]: Dental Chart
          - generic [ref=e78]:
            - paragraph [ref=e79]: Dental Chart
            - paragraph [ref=e80]: Clinical OdontogramPatient Dental Chart
            - paragraph [ref=e81]: MAXILLARY (UPPER)
            - generic [ref=e82]:
              - generic [ref=e83]:
                - paragraph [ref=e85] [cursor=pointer]: "18"
                - paragraph [ref=e103] [cursor=pointer]: "17"
                - paragraph [ref=e121] [cursor=pointer]: "16"
                - paragraph [ref=e140] [cursor=pointer]: "15"
                - paragraph [ref=e154] [cursor=pointer]: "14"
                - paragraph [ref=e168] [cursor=pointer]: "13"
                - paragraph [ref=e181] [cursor=pointer]: "12"
                - paragraph [ref=e194] [cursor=pointer]: "11"
              - generic [ref=e207]:
                - paragraph [ref=e209] [cursor=pointer]: "21"
                - paragraph [ref=e222] [cursor=pointer]: "22"
                - paragraph [ref=e235] [cursor=pointer]: "23"
                - paragraph [ref=e248] [cursor=pointer]: "24"
                - paragraph [ref=e262] [cursor=pointer]: "25"
                - paragraph [ref=e276] [cursor=pointer]: "26"
                - paragraph [ref=e294] [cursor=pointer]: "27"
                - paragraph [ref=e312] [cursor=pointer]: "28"
            - paragraph [ref=e330]: MANDIBULAR (LOWER)
            - generic [ref=e331]:
              - generic [ref=e332]:
                - paragraph [ref=e334] [cursor=pointer]: "48"
                - paragraph [ref=e352] [cursor=pointer]: "47"
                - paragraph [ref=e370] [cursor=pointer]: "46"
                - paragraph [ref=e388] [cursor=pointer]: "45"
                - paragraph [ref=e402] [cursor=pointer]: "44"
                - paragraph [ref=e416] [cursor=pointer]: "43"
                - paragraph [ref=e429] [cursor=pointer]: "42"
                - paragraph [ref=e442] [cursor=pointer]: "41"
              - generic [ref=e455]:
                - paragraph [ref=e457] [cursor=pointer]: "31"
                - paragraph [ref=e470] [cursor=pointer]: "32"
                - paragraph [ref=e483] [cursor=pointer]: "33"
                - paragraph [ref=e496] [cursor=pointer]: "34"
                - paragraph [ref=e510] [cursor=pointer]: "35"
                - paragraph [ref=e524] [cursor=pointer]: "36"
                - paragraph [ref=e542] [cursor=pointer]: "37"
                - paragraph [ref=e560] [cursor=pointer]: "38"
          - generic [ref=e577]:
            - paragraph [ref=e578]: Condition Legend
            - generic [ref=e579]:
              - paragraph [ref=e582]: Healthy
              - paragraph [ref=e585]: Filling
              - paragraph [ref=e588]: Crown
              - paragraph [ref=e591]: Missing
              - paragraph [ref=e594]: Implant
              - paragraph [ref=e597]: Root Canal
              - paragraph [ref=e600]: Bridge
          - generic [ref=e601]:
            - paragraph [ref=e602]: Clinical Summary
            - table [ref=e603]:
              - rowgroup [ref=e604]:
                - row [ref=e605]:
                  - columnheader "Tooth" [ref=e606]
                  - columnheader "Condition" [ref=e607]
                  - columnheader "Surface" [ref=e608]
              - rowgroup [ref=e609]:
                - row [ref=e610]:
                  - cell "0" [ref=e611]
                  - cell "Completed" [ref=e612]
                  - cell "status" [ref=e613]
                - row [ref=e614]:
                  - cell "16" [ref=e615]
                  - cell "filling" [ref=e616]
                  - cell "O" [ref=e617]
                - row [ref=e618]:
                  - cell "16" [ref=e619]
                  - cell "InProgress" [ref=e620]
                  - cell "status" [ref=e621]
  - generic [aria-hidden] [ref=e622]: Filling
```

# Test source

```ts
  156 | 
  157 | 
  158 | 
  159 | 
  160 | 
  161 |         // ==========================
  162 |         // CLICK TOOTH
  163 |         // ==========================
  164 | 
  165 |         const tooth = toothNumber.locator(
  166 |             "xpath=ancestor::div[contains(@class,'MuiBox-root')][1]"
  167 |         );
  168 | 
  169 | 
  170 | 
  171 |         await tooth.click({
  172 |             force: true
  173 |         });
  174 | 
  175 |         console.log(
  176 |             await page.locator("body").innerText()
  177 |         );
  178 | 
  179 |         await page.waitForTimeout(3000);
  180 | 
  181 | 
  182 |         console.log(
  183 |             "TOOTH CLICKED"
  184 |         );
  185 | 
  186 | 
  187 |         await page.screenshot({
  188 |             path: "after-tooth-click.png",
  189 |             fullPage: true
  190 |         });
  191 | 
  192 | 
  193 | 
  194 | 
  195 | 
  196 | 
  197 | 
  198 | 
  199 |         // ==========================
  200 |         // VERIFY SELECTED TOOTH
  201 |         // ==========================
  202 | 
  203 | 
  204 |         await expect(tooth).toBeVisible();
  205 | 
  206 |         console.log(
  207 |             "TOOTH SELECTED"
  208 |         );
  209 | 
  210 | 
  211 | 
  212 |         console.log(
  213 |             await page.locator("button").allInnerTexts()
  214 |         );
  215 | 
  216 | 
  217 | 
  218 | 
  219 |         // ==========================
  220 |         // SELECT SURFACE O
  221 |         // ==========================
  222 | 
  223 | 
  224 |         const surfaceO = page.getByText(
  225 |             "O",
  226 |             {
  227 |                 exact: true
  228 |             }
  229 |         );
  230 | 
  231 |         await expect(surfaceO).toBeVisible();
  232 | 
  233 |         await surfaceO.click();
  234 | 
  235 |         await page.waitForTimeout(1000);
  236 | 
  237 | 
  238 | 
  239 | 
  240 | 
  241 | 
  242 | 
  243 | 
  244 |         // ==========================
  245 |         // APPLY FILLING
  246 |         // ==========================
  247 | 
  248 | 
  249 |         await page.getByRole(
  250 |             "button",
  251 |             {
  252 |                 name: "Filling",
  253 |                 exact: true
  254 |             }
  255 |         )
> 256 |             .click();
      |              ^ Error: locator.click: Test timeout of 90000ms exceeded.
  257 | 
  258 | 
  259 | 
  260 |         await page.waitForTimeout(7000);
  261 | 
  262 | 
  263 | 
  264 |         console.log(
  265 |             "FILLING APPLIED"
  266 |         );
  267 | 
  268 | 
  269 | 
  270 | 
  271 | 
  272 |     });
  273 | 
  274 | 
  275 | });
```