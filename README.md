# node-red-contrib-soap
Node-red nodes that allow users to send SOAP request.


##Usages
To set up SOAP request, create a new soap config:
* Enter the WSDL address to the `WSDL` field. 
* Select `Auth` method, the default would be set to None.
* Fill in *Username*, *Password*, *Client Key*, *Client Certificate*, *Token* if needed.

In the SOAP request config tab, enter the valid method name in *Method* field. Having an invalid method name will return error.

You can also feed in parameters and overwrite configs with an injected msg: 
* You can have `msg.server` to overwrite the WSDL address. This only works with WSDL server with no authentication method.
* You can have `msg.options` to add in options to the SOAP request.
* You can have `msg.headers` to add in headers for the SOAP request.
* You can feed in `msg.payload.<parameters>` to feed in the parameters you need.

For example, here is the sample flow where we try to send a SOAP request to http://holidaywebservice.com//holidayservice_v2/holidayservice2.asmx?wsdl, trying to call the `GetHolidaysAvailable` function with an variable 'countryCode' as 'UnitedStates'.

```
[{"id":"554ea8be.494bc8","type":"soap request","z":"6b9680bf.b9c16","name":"","topic":"","wsdl":"4e7f1cb4.e98fb4","method":"GetHolidaysAvailable","x":608,"y":287,"wires":[["5cc0e89a.f555d8"]]},{"id":"4e7f1cb4.e98fb4","type":"soap-config","z":"","wsdl":"http://holidaywebservice.com//holidayservice_v2/holidayservice2.asmx?wsdl","auth":"0","user":"","pass":"","key":"","cert":"","token":""}]
```

The returned `msg.payload` would be:
```
{"GetHolidaysAvailableResult":{"HolidayCode":[{"Code":"NEW-YEARS-DAY-ACTUAL","Description":"New Year's Day"},{"Code":"NEW-YEARS-DAY-OBSERVED","Description":"New Year's Day"},{"Code":"MARTIN-LUTHER-KING-BIRTHDAY-ACTUAL","Description":"Martin Luther King's Birthday"},{"Code":"MARTIN-LUTHER-KING-BIRTHDAY-OBSERVED","Description":"Martin Luther King's Birthday"},{"Code":"GROUNDHOG-DAY","Description":"Groundhog Day"},{"Code":"LINCOLN-BIRTHDAY","Description":"Abraham Lincoln's Birthday"},{"Code":"VALENTINES-DAY","Description":"Valentine's Day"},{"Code":"WASHINGTON-BIRTHDAY","Description":"George Washington's Birthday"},{"Code":"PRESIDENTS-DAY","Description":"President's Day"},{"Code":"EASTER","Description":"Easter"},{"Code":"GOOD-FRIDAY","Description":"Good Friday"},{"Code":"SHROVE-TUESDAY","Description":"Shrove Tuesday (Fat Tuesday)"},{"Code":"ASH-WEDNESDAY","Description":"Ash Wednesday"},{"Code":"ST-PATRICKS-DAY","Description":"St. Patrick's Day"},{"Code":"APRIL-FOOLS","Description":"April Fools Day"},{"Code":"EARTH-DAY","Description":"Earth Day"},{"Code":"MOTHERS-DAY","Description":"Mother's Day"},{"Code":"MEMORIAL-DAY","Description":"Memorial Day"},{"Code":"CINCO-DE-MAYO","Description":"Cinco de Mayo"},{"Code":"FATHERS-DAY","Description":"Father's Day"},{"Code":"FLAG-DAY","Description":"Flag Day"},{"Code":"INDEPENDENCE-DAY-ACTUAL","Description":"Independence Day"},{"Code":"INDEPENDENCE-DAY-OBSERVED","Description":"Independence Day"},{"Code":"LABOR-DAY","Description":"Labor Day"},{"Code":"PATRIOT-DAY","Description":"Patriot Day"},{"Code":"COLUMBUS-DAY","Description":"Columbus Day"},{"Code":"HALLOWEEN","Description":"Halloween"},{"Code":"VETERANS-DAY-ACTUAL","Description":"Veteran's Day"},{"Code":"VETERANS-DAY-OBSERVED","Description":"Veteran's Day"},{"Code":"THANKSGIVING","Description":"Thanksgiving"},{"Code":"BLACK-FRIDAY","Description":"Black Friday"},{"Code":"CHRISTMAS-ACTUAL","Description":"Christmas"},{"Code":"CHRISTMAS-OBSERVED","Description":"Christmas"},{"Code":"NEW-YEARS-EVE","Description":"New Year's Eve"}]}}
```
