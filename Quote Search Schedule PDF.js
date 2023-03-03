/**
* @NApiVersion 2.x
* @NScriptType Suitelet
*/
define(['N/xml', 'N/record', 'N/search'], function (xml, record, search) {
    function onRequest(context) {

        if (context.request.method === "GET") {

            var rec_id = context.request.parameters.custscript_id;
            //log.debug("rec_id", rec_id);

            var test_rec = record.load({
                type: "estimate",
                id: rec_id,
            });

            var address = test_rec.getValue('billaddress');
            log.debug("address", address);

            var title = test_rec.getValue('title');
            //log.debug("title", title);

            var data = new Array(100);
            for (var i = 0; i < data.length; i++) {
                data[i] = new Array(12)
            }
            var jobSearchObj = search.create({
                type: "job",
                filters:
                    [
                        ["custentity_quote_level", "doesnotcontain", "Summary"],
                        "AND",
                        ["jobname", "startswith", title]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Project ID" }),
                        search.createColumn({ name: "companyname", label: "Project Name" }),
                        search.createColumn({ name: "custentity_lease_name", label: "Lease Name" }),
                        search.createColumn({ name: "startdate", label: "Start Date" }),
                        search.createColumn({ name: "custentity_requested_delivery_date", label: "Requested Delivery Date" }),
                        search.createColumn({ name: "custentity_estimated_delivery_date", label: "Estimated Delivery Date" }),
                        search.createColumn({ name: "custentitysc_asset", label: "Quoted Asset" }),
                        search.createColumn({ name: "custentity_driver_selection", label: "Driver Selected" }),
                        search.createColumn({ name: "custentity_compressor_selection", label: "Compressor Selected" }),
                        search.createColumn({
                            name: "formulatext",
                            formula: "{custentity_sales_notes_1} || {custentity_lease_notes}",
                            label: "Quote Notes"
                        }),
                        search.createColumn({ name: "entitystatus", label: "Status" }),
                        search.createColumn({ name: "custentity_estimate", label: "Estimate" })
                    ]
            });
            var searchResultCount = jobSearchObj.runPaged().count;
            //log.debug("jobSearchObj result count", searchResultCount);

            var i = -1;
            jobSearchObj.run().each(function (result) {
                i += 1; var j = 0;
                data.push([0])
                var projectID = result.getValue({ name: "internalid", label: "Project ID" });
                data[i][j] = projectID; j += 1;
                var projetcName = result.getValue({ name: "companyname", label: "Project Name" });
                data[i][j] = projetcName; j += 1;
                var leaseName = result.getValue({ name: "custentity_lease_name", label: "Lease Name" });
                data[i][j] = leaseName; j += 1;
                var startDate = result.getValue({ name: "startdate", label: "Start Date" });
                data[i][j] = startDate; j += 1;
                var requested_delivery_date = result.getValue({ name: "custentity_requested_delivery_date", label: "Requested Delivery Date" });
                data[i][j] = requested_delivery_date; j += 1;
                var estimated_delivery_date = result.getValue({ name: "custentity_estimated_delivery_date", label: "Estimated Delivery Date" });
                data[i][j] = estimated_delivery_date; j += 1;
                var quotedAsset = result.getValue({ name: "custentitysc_asset", label: "Quoted Asset" });
                data[i][j] = quotedAsset; j += 1;
                var driver_selection = result.getValue({ name: "custentity_driver_selection", label: "Driver Selected" });
                data[i][j] = driver_selection; j += 1;
                var compressor_selection = result.getValue({ name: "custentity_compressor_selection", label: "Compressor Selected" });
                data[i][j] = compressor_selection; j += 1;
                var quoteNotes = result.getValue({
                    name: "formulatext",
                    formula: "{custentity_sales_notes_1} || {custentity_lease_notes}",
                    label: "Quote Notes"
                });
                data[i][j] = quoteNotes; j += 1;
                var status = result.getValue({ name: "entitystatus", label: "Status" });
                data[i][j] = status; j += 1;
                var estimate = result.getValue({ name: "custentity_estimate", label: "Estimate" });
                data[i][j] = estimate;
                return true;
            });
            //log.debug("data", data);

            var date = test_rec.getText('trandate');
            //log.debug("date", date);
            var duedate = test_rec.getText('duedate');
            //log.debug("duedate", duedate);
            var salesrep = test_rec.getText('salesrep');
            //log.debug("salesrep", salesrep);

            var custbody_number_units_needed = test_rec.getValue('custbody_number_units_needed');
            //log.debug("custbody_number_units_needed", custbody_number_units_needed);
            var custbody_rfq_lease_term = test_rec.getValue('custbody_rfq_lease_term');
            //log.debug("custbody_rfq_lease_term", custbody_rfq_lease_term);

            var custbody_suction_pressure = test_rec.getValue('custbody_suction_pressure');
            //log.debug("custbody_suction_pressure", custbody_suction_pressure);
            var custbody_discharge_pressure = test_rec.getValue('custbody_discharge_pressure');
            //log.debug("custbody_discharge_pressure", custbody_discharge_pressure);
            var custbody_volumetric_flow_minimum = test_rec.getValue('custbody_volumetric_flow_minimum');
            //log.debug("custbody_volumetric_flow_minimum", custbody_volumetric_flow_minimum);
            var custbody_volumetric_flow_maximum = test_rec.getValue('custbody_volumetric_flow_maximum');
            //log.debug("custbody_volumetric_flow_maximum", custbody_volumetric_flow_maximum);

            var custbody_specific_gravity = test_rec.getValue('custbody_specific_gravity');
            //log.debug("custbody_specific_gravity", custbody_specific_gravity);

            var total = test_rec.getValue('total');
            //log.debug("total", total);

            var numLines = test_rec.getLineCount({
                sublistId: 'item'
            });

            var xml = "<?xml version=\"1.1\" encoding=\"UTF-8\"?>\n" +
                "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n" +
                "<pdf lang=\"ru-RU\" xml:lang=\"ru-RU\">\n" +
                "<head>\n" +
                "<link name=\"russianfont\" type=\"font\" subtype=\"opentype\" " +
                "src=\"NetSuiteFonts/verdana.ttf\" " +
                "src-bold=\"NetSuiteFonts/verdanab.ttf\" " +
                "src-italic=\"NetSuiteFonts/verdanai.ttf\" " +
                "src-bolditalic=\"NetSuiteFonts/verdanabi.ttf\" " +
                "bytes=\"2\"/>\n" +

                '<style type="text/css">\n' +
                '            table {\n' +
                '                font-size: 10pt;\n' +
                '            }\n' +

                '            th {\n' +
                '                font-weight: bold;\n' +
                '                font-size: 10pt;\n' +
                '                vertical-align: middle;\n' +
                '                padding: 5px;\n' +
                '                background-color: #e3e3e3;\n' +
                '                color: #333333;\n' +
                '            }\n' +

                '            td {\n' +
                '                padding: 5px;\n' +
                '            }\n' +

                '            td p {\n' +
                '                align: left\n' +
                '            }\n' +

                '            b {\n' +
                '                font-weight: bold;\n' +
                '                color: #333333;\n' +
                '            }\n' +

                '            table.header td {\n' +
                '                padding: 5px;\n' +
                '                font-size: 10pt;\n' +
                '            }\n' +

                '            table.footer td {\n' +
                '                padding: 5px;\n' +
                '                font-size: 10pt;\n' +
                '            }\n' +

                '            table.itemtable th {\n' +
                '                padding-bottom: 5px;\n' +
                '                padding-top: 5px;\n' +
                '            }\n' +

                '            table.body td {\n' +
                '                padding-top: 5px;\n' +
                '            }\n' +

                '            table.total {\n' +
                '                page-break-inside: avoid;\n' +
                '            }\n' +

                '            tr.totalrow {\n' +
                '                background-color: #e3e3e3;\n' +
                '                line-height: 200%;\n' +
                '            }\n' +

                '            td.totalboxtop {\n' +
                '                font-size: 12pt;\n' +
                '                background-color: #e3e3e3;\n' +
                '            }\n' +

                '            td.addressheader {\n' +
                '                font-size: 10pt;\n' +
                '                padding-top: 5px;\n' +
                '                padding-bottom: 5px;\n' +
                '            }\n' +

                '            td.address {\n' +
                '                padding-top: 5px;\n' +
                '            }\n' +

                '            td.totalboxmid {\n' +
                '                font-size: 28pt;\n' +
                '                padding-top: 20px;\n' +
                '                background-color: #e3e3e3;\n' +
                '            }\n' +

                '            td.totalboxbot {\n' +
                '                background-color: #e3e3e3;\n' +
                '                font-weight: bold;\n' +
                '            }\n' +

                '            span.title {\n' +
                '                font-size: 28pt;\n' +
                '            }\n' +

                '            span.number {\n' +
                '                font-size: 16pt;\n' +
                '            }\n' +

                '            span.itemname {\n' +
                '                font-weight: bold;\n' +
                '                line-height: 150%;\n' +
                '            }\n' +

                '            hr {\n' +
                '                width: 100%;\n' +
                '                color: #d3d3d3;\n' +
                '                background-color: #d3d3d3;\n' +
                '                height: 1px;\n' +
                '            }\n' +

                '            table.conditions th {\n' +
                '                text-align: center;\n' +
                '                font-weight: bold;\n' +
                '                font-size: 10pt;\n' +
                '                background-color: #e3e3e3;\n' +
                '            }\n' +

                '            table.conditions td {\n' +
                '                text-align: center;\n' +
                '                font-size: 10pt;\n' +
                '            }\n' +
                '        </style>\n' +



                "</head>\n" +

                "<body width=\"30cm\" height=\"30cm\">\n" +

                '<table style="width:100%">\n' +
                '<tr>\n' +
                '<td colspan="2" align="center">\n' +
                '<h2>Quote</h2>\n' +
                '</td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                '<td>\n' +
                '<span style="font-size: 15pt;"><b>Service Compression, LLC</b></span><br/>\n' +
                '<span><br/>2523 86th St<br />\n' +
                'Lubbock TX 79423<br />\n' +
                'United States</span>\n' +
                '</td>\n' +
                '<td align="right">\n' +
                    '<img src="http://4874604-sb1.shop.netsuite.com/core/media/media.nl?id=588&amp;c=4874604_SB1&amp;h=tOaFSj0UaiDPSVjIBBm5ZAp4AiUT-rWs_i_2rTAfwkwdjLHq" width="100" height="100" />\n' +
                '</td>\n' +
                '</tr>\n' +
                '</table>\n' +

                '<table style="width: 100%;">\n' +
                '<tr>\n' +
                '<td style="font-size: 15pt;"><b>Requesting Company</b></td>\n' +
                '</tr>\n' +
                '<tr>\n' +
                '<td>' + address + '</td>\n' +
                '</tr>\n' +
                '</table><br/>\n'

            xml += '<table class="body" style="width: 100%; margin-top: 15px;">\n' +
                '            <tr>\n' +
                '                <th align="center">Quote Number</th>\n' +
                '                <th align="center">Date</th>\n' +
                '                <th align="center">Expires</th>\n' +
                '                <th align="center">Sales Rep</th>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '                <td align="center">' + title + '</td>\n' +
                '                <td align="center">' + date + '</td>\n' +
                '                <td align="center">' + duedate + '</td>\n' +
                '                <td align="center">' + salesrep + '</td>\n' +
                '            </tr>\n' +
                '        </table>\n' +

                '        <table align="center" class="conditions" style="width: 6.0in; margin-top: 40px;">\n' +
                '            <tr>\n' +
                '                <th align="center">Qty Units Requested:</th>\n' +
                '                <th align="center">Quoted Lease Term:</th>\n' +
                '                <th align="center">&nbsp;</th>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '                <td align="center">' + custbody_number_units_needed + '</td>\n' +
                '                <td align="center">' + custbody_rfq_lease_term + '</td>\n' +
                '                <td>&nbsp;</td>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '                <th align="center">Suction Pressure:</th>\n' +
                '                <th align="center">Discharge Pressure:</th>\n' +
                '                <th align="center">Volumetric Flow Range:</th>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '                <td align="center">' + custbody_suction_pressure + '</td>\n' +
                '                <td align="center">' + custbody_discharge_pressure + '</td>\n' +
                '                <td align="center">\n' +
                '                    ' + custbody_volumetric_flow_minimum + '&nbsp;' + custbody_volumetric_flow_maximum + '</td>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '                <th align="center">Specific Gravity</th>\n' +
                '                <th>&nbsp;</th>\n' +
                '                <th>&nbsp;</th>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '                <td align="center">' + custbody_specific_gravity + '</td>\n' +
                '            </tr>\n' +
                '        </table>\n' +

                '        <table class="itemtable" style="width: 100%; margin-top: 20px;">\n' +
                '            <!-- start items -->\n' +
                '            <thead>\n' +
                '                <tr>\n' +
                '                    <th style="width: 20%;">Compressor Identification</th>\n' +
                '                    <th align="right" style="width: 80%;">Monthly Rental Rate</th>\n' +
                '                </tr>\n' +
                '            </thead>\n' +
                '            <tr>\n'

            for (var i = 0; i < numLines; i++) {

                var description = test_rec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'description',
                    line: i,
                });
                var amount = test_rec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    line: i,
                });

                xml += '<td style="width: 20%;">' + description + '</td>\n' +
                    '<td align="right" style="width: 80%;">' + amount + '</td>\n'
            }

            xml += '            </tr>\n' +
                '            <!-- end items -->\n' +
                '        </table>\n' +
                '        &nbsp;\n' +

                '        <hr />\n' +

                '<table style="width: 100%;">\n' +
                '<tr>\n' +
                '<th width="14%">Project ID </th>\n' +
                '<th>Project Name</th>\n' +
                '<th width="8%">Start <br></br> Date</th>\n' +
                '<th width="8%">Lease <br></br> Name</th>\n' +
                '<th width="15%">Requested <br></br> Delivery Date</th>\n' +
                '<th width="15%">Estimated <br></br> Delivery Date</th>\n' +
                '<th width="8%">Quoted <br></br> Asset</th>\n' +
                '<th width="8%">Driver <br></br> Selected</th>\n' +
                '<th width="9%">Compressor <br></br> Selected</th>\n' +
                '<th>Quote Note</th>\n' +
                '<th>Status</th>\n' +
                '<th>Estimate</th>\n' +
                '</tr>\n'


            for (var i = 0; i < searchResultCount; i++) {
                xml += '<tr style="font-size:10; text-align: center; padding: 5px;">\n'
                for (var j = 0; j < 12; j++) {
                    xml += '<td>' + data[i][j] + '</td>\n'
                }
                xml += '</tr>\n'
            }

            xml += '</table><br/>\n'


            // '        <table style="width: 11in; margin-top: 10px;">\n' +
            // '            <tr class="totalrow">\n' +
            // '                <td align="right" style="width: 11in; font-size: 12pt;"><b>Monthly Total Rental Rate</b></td>\n' +
            // '                <td align="left" style="width: 11in; font-size: 12pt;">'+total+' per Unit</td>\n' +
            // '            </tr>\n' +
            // '        </table>\n' +

            // '        <table style="width: 11in; margin-top:10px;">\n' +
            // '            <tr>\n' +
            // '                <td align="center">DELIVERY ESTIMATE SUBJECT TO CHANGE AND PRIOR ORDER</td>\n' +
            // '            </tr>\n' +
            // '            <tr>\n' +
            // '                <td align="center">Unless otherwise noted this quote will not include inbound or outbound freight\n' +
            // '                    charges.</td>\n' +
            // '            </tr>\n' +
            // '            <tr>\n' +
            // '                <td align="center">Pricing does not include applicable taxes.</td>\n' +
            // '            </tr>\n' +
            // '            <tr>\n' +
            // '                <td align="center">Thank you for the opportunity to submit our services.</td>\n' +
            // '            </tr>\n' +
            // '        </table>\n'



            xml += "</body>\n" +
                "</pdf>";
            context.response.renderPdf(xml);
        } else {

        }
    }
    return {
        onRequest: onRequest,
    };
});

