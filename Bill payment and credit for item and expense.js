/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(['N/record', 'N/email', 'N/search'], function (record, email, search) {

    function afterSubmit(Context) {
        var temp = 0;
        var record_Id = Context.newRecord.id; //record id
        log.debug('recordId', record_Id);

        var record_Type = Context.newRecord.type; //record type
        log.debug('recordType', record_Type);

        if (record_Type == 'vendorpayment') {
            var bill_payment = record.load({        //load the respected record
                type: record_Type,
                id: record_Id
            });
            //log.debug('bill_payment', bill_payment);

            var status = bill_payment.getText({
                fieldId: 'approvalstatus'
            })
            log.debug('status', status);
            if (status == 'Approved') {
                var Line_count = bill_payment.getLineCount({        //no of bills
                    sublistId: 'apply'
                });
                log.debug('Line', Line_count);

                for (var i = 0; i < Line_count; i++) {
                    var BillID = bill_payment.getSublistValue({     //getting the internal id of the bill
                        sublistId: 'apply',
                        fieldId: 'internalid',
                        line: i
                    });
                    log.debug('BillID', BillID);

                    var total = bill_payment.getSublistValue({      //getting the bill payment amount
                        sublistId: 'apply',
                        fieldId: 'amount',
                        line: i
                    });
                    total = Number(total);
                    log.debug('total', total);

                    var bill = record.load({        //load the bill
                        type: "vendorbill",
                        id: BillID
                    });
                    //log.debug('bill', bill);

                    var status = bill_payment.getText({
                        fieldId: 'approvalstatus'
                    })
                    log.debug('status', status);
                    if (status == 'Approved') {

                        //Bill Payment and Credit for Item = Start
                        var bill_count = bill.getLineCount({        // no of item lines
                            sublistId: 'item'
                        });
                        log.debug('bill_count', bill_count);

                        if (bill_count > 0) {
                            for (var j = 0; j < bill_count; j++) {      // iterate each item row
                                var amount = bill.getSublistValue({     // taking the amount for that item
                                    sublistId: 'item',
                                    fieldId: 'amount',
                                    line: j
                                });
                                amount = Number(amount);
                                log.debug('amount', amount);

                                var vender_paid = bill.getSublistValue({        // taking vendor paid amount
                                    sublistId: 'item',
                                    fieldId: 'custcol_vendor_paid',
                                    line: j
                                });
                                vender_paid = Number(vender_paid);
                                log.debug('vender_paid', vender_paid);

                                if (vender_paid == amount) {      // ender_paid == amount means payment done
                                    continue;
                                }
                                if (vender_paid != amount) {        // ender_paid != amount means payment is not done
                                    amount = amount - vender_paid
                                }

                                if (amount <= total) {      // amount <= total means partioally payment or not payment
                                    total = total - amount;
                                }
                                else if (total != 0) {
                                    amount = total;
                                    total = 0;
                                } else if (total == 0) {
                                    break;
                                }
                                log.debug('total', total);

                                amount = amount + vender_paid;
                                var bill_paid = bill.setSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'custcol_vendor_paid',
                                    line: j,
                                    value: amount
                                });
                            }
                            var save_rec = bill.save();
                            log.debug({
                                title: 'save_rec',
                                details: 'save_rec' + save_rec
                            });
                        }
                        //Bill Payment and Credit for Item = End

                        //Bill Payment and Credit for Expense = Start
                        var bill_count = bill.getLineCount({        // no of expense lines
                            sublistId: 'expense'
                        });
                        log.debug('bill_count', bill_count);

                        if (bill_count > 0) {
                            for (var j = 0; j < bill_count; j++) {      // iterate each expense row
                                var amount = bill.getSublistValue({     // taking the amount for that expense
                                    sublistId: 'expense',
                                    fieldId: 'amount',
                                    line: j
                                });
                                amount = Number(amount);
                                log.debug('amount', amount);

                                var vender_paid = bill.getSublistValue({        // taking vendor paid amount
                                    sublistId: 'expense',
                                    fieldId: 'custcol_vendor_paid',
                                    line: j
                                });
                                vender_paid = Number(vender_paid);
                                log.debug('vender_paid', vender_paid);

                                if (vender_paid == amount) {      // ender_paid == amount means payment done
                                    continue;
                                }
                                if (vender_paid != amount) {        // ender_paid != amount means payment is not done
                                    amount = amount - vender_paid
                                }

                                if (amount <= total) {      // amount <= total means partioally payment or not payment
                                    total = total - amount;
                                }
                                else if (total != 0) {
                                    amount = total;
                                    total = 0;
                                } else if (total == 0) {
                                    break;
                                }
                                log.debug('total', total);

                                amount = amount + vender_paid;
                                var bill_paid = bill.setSublistValue({
                                    sublistId: 'expense',
                                    fieldId: 'custcol_vendor_paid',
                                    line: j,
                                    value: amount
                                });
                            }
                            var save_rec = bill.save();
                            log.debug({
                                title: 'save_rec',
                                details: 'save_rec' + save_rec
                            });
                        }
                        //Bill Payment and Credit for Expense = End
                    }
                }
            }
        } else if (record_Type == 'vendorcredit') {     // process for vendor credit
            var bill_credit = record.load({     // load the vendor credit
                type: record_Type,
                id: record_Id
            });
            //log.debug('bill_credit', bill_credit);

            var Line_count = bill_credit.getLineCount({     // count the credit
                sublistId: 'apply'
            });
            //log.debug('Line', Line_count);

            var total = bill_credit.getValue({      // total credit amount
                fieldId: 'applied',
            });
            total = Number(total);
            log.debug('total', total);

            for (var i = 0; i < Line_count; i++) {
                var BillID = bill_credit.getSublistValue({      // takking the bill internal id
                    sublistId: 'apply',
                    fieldId: 'internalid',
                    line: i
                });
                //log.debug('BillID', BillID);

                var bill = record.load({        // load the bill
                    type: "vendorbill",
                    id: BillID
                });
                //log.debug('bill', bill);

                var status = bill.getText({
                    fieldId: 'approvalstatus'
                })
                //log.debug('status', status);
                if (status == 'Approved') {

                    //Bill Payment and Credit for item = start
                    var bill_count = bill.getLineCount({        // count the no of items in the bill
                        sublistId: 'item'
                    });
                    //log.debug('bill_count', bill_count);

                    if (bill_count > 0) {
                        for (var j = 0; j < bill_count; j++) {      // iterate the each item
                            var vendor_credit = bill.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_vendor_paid',
                                line: j
                            });
                            vendor_credit = Number(vendor_credit);
                            log.debug('vendor_credit1', vendor_credit);
                            var temp1 = vendor_credit;

                            if (vendor_credit == 0) {
                                continue;
                            }
                            if (vendor_credit <= total) {
                                total = total - vendor_credit;
                                temp = vendor_credit
                            }
                            else if (total != 0) {
                                vendor_credit = total;
                                temp = total;
                                total = 0;
                            } else if (total == 0) {
                                break;
                            }
                            log.debug('vendor_credit2', vendor_credit);
                            log.debug('total', total);

                            vendor_credit = temp1 - temp;
                            log.debug('vendor_credit', vendor_credit);

                            var bill_pay = bill.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_vendor_paid',
                                line: j,
                                value: vendor_credit
                            });
                            log.debug({
                                title: 'bill_pay',
                                details: 'bill_pay' + bill_pay
                            });
                        }
                        var save_rec = bill.save();
                        log.debug({
                            title: 'save_rec',
                            details: 'save_rec' + save_rec
                        });
                    }
                    //Bill Payment and Credit for item = end

                    //Bill Payment and Credit for expense = start
                    var bill_count = bill.getLineCount({        // count the no of expense in the bill
                        sublistId: 'expense'
                    });
                    //log.debug('bill_count', bill_count);

                    if (bill_count > 0) {
                        for (var j = 0; j < bill_count; j++) {      // iterate the each expense
                            var vendor_credit = bill.getSublistValue({
                                sublistId: 'expense',
                                fieldId: 'custcol_vendor_paid',
                                line: j
                            });
                            vendor_credit = Number(vendor_credit);
                            log.debug('vendor_credit1', vendor_credit);
                            var temp1 = vendor_credit;

                            if (vendor_credit == 0) {
                                continue;
                            }
                            if (vendor_credit <= total) {
                                total = total - vendor_credit;
                                temp = vendor_credit
                            }
                            else if (total != 0) {
                                vendor_credit = total;
                                temp = total;
                                total = 0;
                            } else if (total == 0) {
                                break;
                            }
                            log.debug('vendor_credit2', vendor_credit);
                            log.debug('total', total);

                            vendor_credit = temp1 - temp;
                            log.debug('vendor_credit', vendor_credit);

                            var bill_pay = bill.setSublistValue({
                                sublistId: 'expense',
                                fieldId: 'custcol_vendor_paid',
                                line: j,
                                value: vendor_credit
                            });
                            log.debug({
                                title: 'bill_pay',
                                details: 'bill_pay' + bill_pay
                            });
                        }
                        var save_rec = bill.save();
                        log.debug({
                            title: 'save_rec',
                            details: 'save_rec' + save_rec
                        });
                    }
                    //Bill Payment and Credit for expense = end
                }
            }
        }

    }

    return {
        afterSubmit: afterSubmit

    }
});
