# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\dental-chart.spec.js >> Dental Chart Tests >> Doctor can open dental chart and update tooth
- Location: tests\dental-chart.spec.js:12:9

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.click: Test timeout of 90000ms exceeded.
Call log:
  - waiting for getByText('18', { exact: true }).locator('xpath=ancestor::div[@class=\'MuiBox-root\'][1]')

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
            - generic [ref=e59]: AH
            - generic [ref=e60]:
              - paragraph [ref=e61]: ahmad
              - generic [ref=e62]: Active Patient
              - paragraph [ref=e64]: "Patient ID #2"
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
                - paragraph [ref=e139] [cursor=pointer]: "15"
                - paragraph [ref=e153] [cursor=pointer]: "14"
                - paragraph [ref=e167] [cursor=pointer]: "13"
                - paragraph [ref=e180] [cursor=pointer]: "12"
                - paragraph [ref=e193] [cursor=pointer]: "11"
              - generic [ref=e206]:
                - paragraph [ref=e208] [cursor=pointer]: "21"
                - paragraph [ref=e221] [cursor=pointer]: "22"
                - paragraph [ref=e234] [cursor=pointer]: "23"
                - paragraph [ref=e247] [cursor=pointer]: "24"
                - paragraph [ref=e261] [cursor=pointer]: "25"
                - paragraph [ref=e275] [cursor=pointer]: "26"
                - paragraph [ref=e293] [cursor=pointer]: "27"
                - paragraph [ref=e311] [cursor=pointer]: "28"
            - paragraph [ref=e329]: MANDIBULAR (LOWER)
            - generic [ref=e330]:
              - generic [ref=e331]:
                - paragraph [ref=e333] [cursor=pointer]: "48"
                - paragraph [ref=e351] [cursor=pointer]: "47"
                - paragraph [ref=e369] [cursor=pointer]: "46"
                - paragraph [ref=e387] [cursor=pointer]: "45"
                - paragraph [ref=e401] [cursor=pointer]: "44"
                - paragraph [ref=e415] [cursor=pointer]: "43"
                - paragraph [ref=e428] [cursor=pointer]: "42"
                - paragraph [ref=e441] [cursor=pointer]: "41"
              - generic [ref=e454]:
                - paragraph [ref=e456] [cursor=pointer]: "31"
                - paragraph [ref=e469] [cursor=pointer]: "32"
                - paragraph [ref=e482] [cursor=pointer]: "33"
                - paragraph [ref=e495] [cursor=pointer]: "34"
                - paragraph [ref=e509] [cursor=pointer]: "35"
                - paragraph [ref=e523] [cursor=pointer]: "36"
                - paragraph [ref=e541] [cursor=pointer]: "37"
                - paragraph [ref=e559] [cursor=pointer]: "38"
          - generic [ref=e576]:
            - paragraph [ref=e577]: Condition Legend
            - generic [ref=e578]:
              - paragraph [ref=e581]: Healthy
              - paragraph [ref=e584]: Filling
              - paragraph [ref=e587]: Crown
              - paragraph [ref=e590]: Missing
              - paragraph [ref=e593]: Implant
              - paragraph [ref=e596]: Root Canal
              - paragraph [ref=e599]: Bridge
          - generic [ref=e600]:
            - paragraph [ref=e601]: Clinical Summary
            - table [ref=e602]:
              - rowgroup [ref=e603]:
                - row [ref=e604]:
                  - columnheader "Tooth" [ref=e605]
                  - columnheader "Condition" [ref=e606]
                  - columnheader "Surface" [ref=e607]
              - rowgroup [ref=e608]:
                - row [ref=e609]:
                  - cell "42" [ref=e610]
                  - cell "Bridge" [ref=e611]
                  - cell "bridge" [ref=e612]
                - row [ref=e613]:
                  - cell "42" [ref=e614]
                  - cell "NeedsTreatment" [ref=e615]
                  - cell "status" [ref=e616]
                - row [ref=e617]:
                  - cell "43" [ref=e618]
                  - cell "Bridge" [ref=e619]
                  - cell "bridge" [ref=e620]
                - row [ref=e621]:
                  - cell "43" [ref=e622]
                  - cell "NeedsTreatment" [ref=e623]
                  - cell "status" [ref=e624]
                - row [ref=e625]:
                  - cell "44" [ref=e626]
                  - cell "Bridge" [ref=e627]
                  - cell "bridge" [ref=e628]
                - row [ref=e629]:
                  - cell "44" [ref=e630]
                  - cell "NeedsTreatment" [ref=e631]
                  - cell "status" [ref=e632]
  - generic [aria-hidden] [ref=e633]: filling
```

# Test source

```ts
  72  |             "PROFILE:",
  73  |             page.url()
  74  |         );
  75  | 
  76  | 
  77  | 
  78  | 
  79  | 
  80  | 
  81  | 
  82  |         // ==========================
  83  |         // OPEN DENTAL CHART
  84  |         // ==========================
  85  | 
  86  | 
  87  |         await page.getByRole(
  88  |             "tab",
  89  |             {
  90  |                 name:"Dental Chart"
  91  |             }
  92  |         )
  93  |         .click();
  94  | 
  95  | 
  96  | 
  97  |         await page.waitForTimeout(5000);
  98  | 
  99  | 
  100 | 
  101 |         console.log(
  102 |             "DENTAL TAB OPENED"
  103 |         );
  104 | 
  105 | 
  106 | 
  107 | 
  108 | 
  109 | 
  110 | 
  111 |         // ==========================
  112 |         // VERIFY TAB ACTIVE
  113 |         // ==========================
  114 | 
  115 | 
  116 |         await expect(
  117 |             page.getByRole(
  118 |                 "tab",
  119 |                 {
  120 |                     name:"Dental Chart"
  121 |                 }
  122 |             )
  123 |         )
  124 |         .toHaveAttribute(
  125 |             "aria-selected",
  126 |             "true"
  127 |         );
  128 | 
  129 | 
  130 | 
  131 | 
  132 | 
  133 | 
  134 | 
  135 |         // ==========================
  136 |         // SELECT TOOTH 18
  137 |         // ==========================
  138 | 
  139 | 
  140 |         const toothNumber =
  141 |             page.getByText(
  142 |                 "18",
  143 |                 {
  144 |                     exact:true
  145 |                 }
  146 |             );
  147 | 
  148 | 
  149 | 
  150 |         await expect(
  151 |             toothNumber
  152 |         )
  153 |         .toBeVisible();
  154 | 
  155 | 
  156 | 
  157 |         console.log(
  158 |             "TOOTH FOUND"
  159 |         );
  160 | 
  161 | 
  162 | 
  163 |         // click Tooth parent (the Box with onClick)
  164 | 
  165 |         const tooth =
  166 |             toothNumber.locator(
  167 |                 "xpath=ancestor::div[@class='MuiBox-root'][1]"
  168 |             );
  169 | 
  170 | 
  171 | 
> 172 |         await tooth.click({
      |                     ^ Error: locator.click: Test timeout of 90000ms exceeded.
  173 |             force:true
  174 |         });
  175 | 
  176 | 
  177 | 
  178 |         await page.waitForTimeout(3000);
  179 | 
  180 | 
  181 | 
  182 |         console.log(
  183 |             "TOOTH CLICKED"
  184 |         );
  185 | 
  186 | 
  187 | 
  188 | 
  189 | 
  190 | 
  191 | 
  192 |         // ==========================
  193 |         // VERIFY SELECTED TOOTH
  194 |         // ==========================
  195 | 
  196 | 
  197 |         await expect(
  198 |             page.getByText(
  199 |                 "Selected Tooth: 18",
  200 |                 {
  201 |                     exact:false
  202 |                 }
  203 |             )
  204 |         )
  205 |         .toBeVisible();
  206 | 
  207 | 
  208 | 
  209 |         console.log(
  210 |             "TOOTH SELECTED"
  211 |         );
  212 | 
  213 | 
  214 | 
  215 | 
  216 | 
  217 | 
  218 | 
  219 | 
  220 |         // ==========================
  221 |         // SELECT SURFACE O
  222 |         // ==========================
  223 | 
  224 | 
  225 |         await page.getByRole(
  226 |             "button",
  227 |             {
  228 |                 name:"O"
  229 |             }
  230 |         )
  231 |         .click();
  232 | 
  233 | 
  234 | 
  235 |         await page.waitForTimeout(1000);
  236 | 
  237 | 
  238 | 
  239 | 
  240 | 
  241 | 
  242 | 
  243 |         // ==========================
  244 |         // APPLY FILLING
  245 |         // ==========================
  246 | 
  247 | 
  248 |         await page.getByRole(
  249 |             "button",
  250 |             {
  251 |                 name:"Filling"
  252 |             }
  253 |         )
  254 |         .click();
  255 | 
  256 | 
  257 | 
  258 |         await page.waitForTimeout(7000);
  259 | 
  260 | 
  261 | 
  262 |         console.log(
  263 |             "FILLING APPLIED"
  264 |         );
  265 | 
  266 | 
  267 | 
  268 |     });
  269 | 
  270 | 
  271 | });
```