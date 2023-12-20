# Handlebars Helper Documentation

This documentation provides details and examples for each custom Handlebars helper defined in the provided code.

## 1. `isArray`

Checks if the provided context is an array.

**Example:**

```handlebars
{{#isArray myArray}}
  <!-- Code to execute if myArray is an array -->
{{else}}
  <!-- Code to execute if myArray is not an array -->
{{/isArray}}
```

## 2. `formatDate`

Formats a date according to the specified format, locale, and timezone.

**Example:**

```handlebars
{{formatDate "2023-01-01T12:00:00" "medium" "en-us" "+05:30"}}
```

## 3. `formatDateTime`

Formats a date and time according to the specified format, locale, and timezone.

**Example:**

```handlebars
{{formatDateTime "2023-01-01T12:00:00" "medium" "en-us" "+05:30"}}
```

## 4. `remove`

Removes specified strings from the input string.

**Example:**

```handlebars
{{remove "Hello, world!" "world"}}
```

## 5. `isJSON`

Checks if the provided context is a JSON object.

**Example:**

```handlebars
{{#isJSON myObject}}
  <!-- Code to execute if myObject is a JSON object -->
{{else}}
  <!-- Code to execute if myObject is not a JSON object -->
{{/isJSON}}
```

## 6. `ifEquals`

Conditionally executes code based on equality.

**Example:**

```handlebars
{{#ifEquals variable1 variable2}}
  <!-- Code to execute if variable1 equals variable2 -->
{{else}}
  <!-- Code to execute if variable1 does not equal variable2 -->
{{/ifEquals}}
```

## 7. `stringify`

Converts an object to as json string

**Example:**

```handlebars
{{stringify myObject}}
```

## 8. `parse`

Parses a JSON string into an object.

**Example:**

```handlebars
{{#parse jsonString}}
  <!-- Access properties of the parsed object -->
  {{property1}}
{{/parse}}
```

## 9. `ifMatches`

Checks if a string matches a regular expression.

**Example:**

```handlebars
{{#ifMatches myString "pattern"}}
  <!-- Code to execute if myString matches the pattern -->
{{else}}
  <!-- Code to execute if myString does not match the pattern -->
{{/ifMatches}}
```

## 10. `raw-helper`

Returns the raw content without rendering Handlebars expressions.

**Example:**

```handlebars
{{#raw-helper}}
  <p>This is raw HTML content: {{variable}}</p>
{{/raw-helper}}
```

## 11. `isEmail`

Checks if the provided string is a valid email address.

**Example:**

```handlebars
{{#isEmail "user@example.com"}}
  <!-- Code to execute if the email is valid -->
{{else}}
  <!-- Code to execute if the email is not valid -->
{{/isEmail}}
```

## 12. `getNumberFromText`

Extracts a number from the given text.

**Example:**

```handlebars
{{getNumberFromText "The price is $500"}}
```

## 13. `default`

Provides a default value if the key is falsy.

**Example:**

```handlebars
{{default myKey "Default Value"}}
```

## 14. `ifStartsWith`

Conditionally executes code based on whether a string starts with a specified prefix.

**Example:**

```handlebars
{{#ifStartsWith myString "prefix"}}
  <!-- Code to execute if myString starts with "prefix" -->
{{else}}
  <!-- Code to execute if myString does not start with "prefix" -->
{{/ifStartsWith}}
```

## 15. `isExpo`

Extracts the Expo token from a string if present.

**Example:**

```handlebars
{{isExpo "expo_token:ABC123"}}
```

## 16. `isFCM`

Extracts the FCM token from a string if present.

**Example:**

```handlebars
{{isFCM "fcm_token:XYZ789"}}
```

## 17. `isOnesignal`

Extracts Onesignal selector and token from a string if present.

**Example:**

```handlebars
{{#isOnesignal "onesignal_player_id:12345"}}
  <!-- Access properties: {{onesignal_selector}}, {{onesignal_token}} -->
{{else}}
  <!-- Code to execute if the string does not match Onesignal format -->
{{/isOnesignal}}
```

## 18. `isEmpty`

Checks if an object is empty.

**Example:**

```handlebars
{{#isEmpty myObject}}
  <!-- Code to execute if myObject is empty -->
{{else}}
  <!-- Code to execute if myObject is not empty -->
{{/isEmpty}}
```

## 19. `setVariable`

Sets a variable in the root context.

**Example:**

```handlebars
{{setVariable "myVar" "myValue"}}
```

## 20. `pushCallback`

Pushes callback information into the root context.

**Example:**

```handlebars
{{pushCallback}}
```

## 21. `generateNotifyId`

Generates a notification ID based on the provided key.

**Example:**

```handlebars
{{generateNotifyId "myKey"}}
```

## 22. `dateDiff`

Calculates the difference between two dates.

**Example:**

```handlebars
{{dateDiff "2023-01-01T12:00:00" "NOW" "days"}}
```

## 23. `compare`

Compares two values based on the specified operator.

**Example:**

```handlebars
{{#compare value1 "eq" value2}}
  <!-- Code to execute if value1 equals value2 -->
{{else}}
  <!-- Code to execute if value1 does not equal value2 -->
{{/compare}}
```

## 24. `eq, ne, lt, gt, lte, gte, and, or`

Logical comparison helpers.

**Example:**

```handlebars
{{#eq variable1 variable2}}
  <!-- Code to execute if variable1 equals variable2 -->
{{/eq}}
```

## 25. `split`

Splits a string into an array using a specified delimiter.

**Example:**

```handlebars
{{#split "apple,orange,banana" ","}}
  <!-- Access individual elements in the array -->
  {{this}}
{{/split}}
```

## 26. `math`

Performs basic arithmetic operations on two values.

**Example:**

```handlebars
{{math 10 "+" 5}}
```

## 27. `relativeDay`

Determines the relationship of a given date to the current date.

**Example:**

```handlebars
{{relativeDay "2023-01-01"}}
```

## 28. `trim`

Trims a string to a specified length and delimiter.

**Example:**

```handlebars
{{trim "This is a long string" 10 "..."}}
```

## 29. `formatNumber`

Formats a number using the specified locale.

**Example:**

```handlebars
{{formatNumber 1234567.89 "en-US"}}
```
