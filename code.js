function runToAuthorizeScopes() {
    /* 
    Run this after setting the scopes to authorize the script before you trigger it via onEdit
    To add the requierd scopes - open up your appsscript.json file via Settings and add this: 
    
    "oauthScopes": [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://mail.google.com/"
    ]
  
    */
    console.log(`Make sure to update your appsscript.json file before running this`)
  }
  
  function scriptSettings() {
    return {
      triggerColumn: 'C', //"ENTER COLUMN - e.g. D",
      dataEndingColumn:  'C', // "ENTER THE COLUMN IN WHICH THE TARGET DATA ENDS - e.g. Z",
      recipientColumn:  'B', // "ENTER THE COLUMN THAT CONTAINS YOUR RECIPIENT - e.g. Z",
      emailSubjectColumn:  'K', // "ENTER THE COLUMN THAT CONTAINS YOUR EMAIL SUBJECT - e.g. Z",
      emailBodyColumn:  'L', // "ENTER THE COLUMN THAT CONTAINS YOUR EMAIL BODY - e.g. Z",
    }
  }
  
  function translateLetterToColumn(letter) {
    let column = 0
    for (i=0; i < letter.length; i++) {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, letter.length - i - 1)
    }
    return column
  }
  
  function onCheckboxEdit(e) {
    const triggeredValues = {
      sheet: e.source.getActiveSheet(),
      row: e.range.getRow(),
      column: e.range.getColumn(),
    }
    var html = HtmlService.createTemplateFromFile("email.html");
    var htmlText = html.evaluate().getContent();
    Logger.log(htmlText);

    var targetRange = triggeredValues.sheet.getRange(triggeredValues.row, 1, 1, translateLetterToColumn(scriptSettings().dataEndingColumn))
    var targetValues = targetRange.getValues()
    var options = {htmlBody: htmlText, name: 'GDG C'};    
    var textBody = "This email requires HTML Support";


    var recipient = targetValues[0][translateLetterToColumn(scriptSettings().recipientColumn)-1]
    var checkboxValue = targetValues[0][translateLetterToColumn(scriptSettings().triggerColumn)-1];
    var subject1 = "Subject Line Goes Here";
    var subject = targetValues[0][translateLetterToColumn(scriptSettings().emailSubjectColumn)-1]
  
    if(triggeredValues.column = translateLetterToColumn(scriptSettings().triggerColumn) && checkboxValue == true) {
      console.log("Checkbox was marked true")
      console.log(`Sending email to ${recipient}`)
      GmailApp.sendEmail(recipient, subject1, textBody, options);
    } else if (triggeredValues.column = translateLetterToColumn(scriptSettings().triggerColumn) && checkboxValue == false) {
      console.log("Checkbox was marked false")
    } else {
      console.log("Something unexpected happened")
    }
  }
