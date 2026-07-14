sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("stolifecycle.controller.lifecycledrilldown", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("Routelifecycledrilldown")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {

            this.getView().setBusy(true);

            var sData = oEvent.getParameter("arguments").STOData;
            var oData = JSON.parse(decodeURIComponent(sData));

            this.getView().setModel(
                new JSONModel(oData),
                "detail"
            );

            // var oModel = this.getOwnerComponent().getModel();

            // oModel.read("/Dashboard", {
            //     filters: [
            //         new Filter(
            //             "STONumber",
            //             FilterOperator.EQ,
            //             oData.STONumber
            //         )
            //     ],

            //     success: function (oResponse) {

            //         this.getView().setModel(
            //             new JSONModel(oResponse.results),
            //             "items"
            //         );

            //         var oItem = oResponse.results[0];



            //         var oGraphData = {

            //             nodes: [

            //                 {
            //                     key: "STO",
            //                     title: "STO PO",
            //                     description: oItem.STONumber,
            //                     status: "Success"
            //                 },

            //                 {
            //                     key: "DEL",
            //                     title: "Delivery",
            //                     description: oItem.DeliveryNumber || "Pending",
            //                     status: oItem.DeliveryNumber ? "Success" : "Warning"
            //                 },

            //                 {
            //                     key: "GR",
            //                     title: "Goods Receipt",
            //                     description: oItem.GRMatDocNumber || "Pending",
            //                     status: oItem.GRStatus === "COMPLETED"
            //                         ? "Success"
            //                         : "Warning"
            //                 }
            //                 ,

            //                 {
            //                     key: "GI",
            //                     title: "Goods Issue",
            //                     description: oItem.PGIMatDocNumber || "Pending",
            //                     status: oItem.PGIStatus === "COMPLETED"
            //                         ? "Success"
            //                         : "Warning"
            //                 },

            //                 {
            //                     key: "CINV",
            //                     title: "Customer Invoice",
            //                     description: "Pending",
            //                     status: "Warning"
            //                 },

            //                 {
            //                     key: "SIT",
            //                     title: "Stock In Transit",
            //                     description: "In Transit",
            //                     status: "Information"
            //                 },
            //                 {
            //                     key: "INV",
            //                     title: "Invoice",
            //                     description: oItem.InvoiceDocument || "Pending",
            //                     status: oItem.InvoiceDocument
            //                         ? "Success"
            //                         : "Warning"
            //                 }

            //             ],

            //             lines: [
            //                 {
            //                     from: "STO",
            //                     to: "GR"
            //                 },
            //                 {
            //                     from: "STO",
            //                     to: "DEL"
            //                 },
            //                 {
            //                     from: "DEL",
            //                     to: "GI"
            //                 },
            //                 {
            //                     from: "GI",
            //                     to: "CINV"
            //                 },
            //                 {
            //                     from: "GI",
            //                     to: "SIT"
            //                 },
            //                 {
            //                     from: "SIT",
            //                     to: "GR"
            //                 },
            //                 {
            //                     from: "GR",
            //                     to: "INV"
            //                 }


            //             ]


            //         };

            //         this.getView().setModel(
            //             new JSONModel(oGraphData),
            //             "graph"
            //         );

            //         this.getView().setBusy(false);

            //     }.bind(this),

            //     error: function (err) {
            //         this.getView().setBusy(false);
            //     }.bind(this)
            // });
            this._loadDashboardData(oData.STONumber);

        },
        _loadDashboardData: function (sSTONumber) {

            this.getView().setBusy(true);

            var oModel = this.getOwnerComponent().getModel();

            oModel.read("/Dashboard", {
                filters: [
                    new Filter("STONumber", FilterOperator.EQ, sSTONumber)
                ],
                success: function (oResponse) {

                    this.getView().setModel(
                        new JSONModel(oResponse.results),
                        "items"
                    );

                    var oItem = oResponse.results[0];

                    var oGraphData = {

                        nodes: [

                            {
                                key: "STO",
                                title: "STO PO",
                                description: oItem.STONumber,
                                status: "Success"
                            },

                            {
                                key: "DEL",
                                title: "Delivery",
                                description: oItem.DeliveryNumber || "Pending",
                                status: oItem.DeliveryNumber ? "Success" : "Warning"
                            },

                            {
                                key: "GR",
                                title: "Goods Receipt",
                                description: oItem.GRMatDocNumber || "Pending",
                                status: oItem.GRStatus === "COMPLETED"
                                    ? "Success"
                                    : "Warning"
                            }
                            ,

                            {
                                key: "GI",
                                title: "Goods Issue",
                                description: oItem.PGIMatDocNumber || "Pending",
                                status: oItem.PGIStatus === "POSTED"
                                    ? "Success"
                                    : "Warning"
                            },

                            {
                                key: "CINV",
                                title: "Customer Invoice",
                                description: oItem.BillingDocument || "Pending",
                                status: oItem.BillingDocument ? "Success" : "Warning"
                            },

                            {
                                key: "SIT",
                                title: "Stock In Transit",
                                description:  (oItem.PGIMatDocNumber && oItem.GRMatDocNumber)? "Completed" : "Pending",
                                status: (oItem.PGIMatDocNumber && oItem.GRMatDocNumber)? "Success" : "Warning"
                            },
                            {
                                key: "INV",
                                title: "Invoice",
                                description: oItem.InvoiceDocument || "Pending",
                                status: oItem.InvoiceDocument
                                    ? "Success"
                                    : "Warning"
                            }

                        ],

                        lines: [
                            {
                                from: "STO",
                                to: "GR"
                            },
                            {
                                from: "STO",
                                to: "DEL"
                            },
                            {
                                from: "DEL",
                                to: "GI"
                            },
                            {
                                from: "GI",
                                to: "CINV"
                            },
                            {
                                from: "GI",
                                to: "SIT"
                            },
                            {
                                from: "SIT",
                                to: "GR"
                            },
                            {
                                from: "GR",
                                to: "INV"
                            }


                        ]


                    };

                    this.getView().setModel(
                        new JSONModel(oGraphData),
                        "graph"
                    );

                    // Update detail model with latest data
                    this.getView().getModel("detail").setData(oItem);

                    this.getView().setBusy(false);

                }.bind(this),

                error: function () {
                    this.getView().setBusy(false);
                }.bind(this)
            });
        },
        onDocumentPress: function (oEvent) {

            var oLink = oEvent.getSource();

            var oContext = oLink.getBindingContext("graph");
            var oNodeData = oContext.getObject();

            var sKey = oNodeData.key;
            var sDocNumber = oNodeData.description;

            console.log("Key:", sKey);
            console.log("Document Number:", sDocNumber);
            var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

            if (sKey === "STO") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "PurchaseOrder",
                        action: "manage"
                    },
                    params: {
                        "PurchaseOrder": sDocNumber
                    }

                });

            } else if (sKey === "DEL") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "OutboundDelivery",
                        action: "displayOutboundDelivery"
                    },
                    params: {
                        "DeliveryDocument": sDocNumber
                    }
                });

            } else if (sKey === "GR") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "MaterialMovement",
                        action: "displayFactSheet"
                    },
                    params: {
                        "MaterialDocument": sDocNumber
                    }
                });

            } else if (sKey === "GI") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "MaterialMovement",
                        action: "displayFactSheet"
                    },
                    params: {
                        "MaterialDocument": sDocNumber
                    }
                });

            } else if (sKey === "INV") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "SupplierInvoice",
                        action: "displayAdvanced"
                    },
                    params: {
                        "SupplierInvoice": sDocNumber
                    }
                });

            } else if (sKey === "SIT") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "Material",
                        action: "displayStockInTransitInWebGUI"
                    },
                    params: {
                        "Material": sDocNumber
                    }
                });

            } else if (sKey === "CINV") {
                oCrossAppNav.toExternal({
                    target: {
                        semanticObject: "BillingDocument",
                        action: "displayBillingDocument"
                    },
                    params: {
                        "BillingDocument": sDocNumber
                    }
                });
            }
        },
        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Routedashboard", {}, true);
            this.getView().setBusy(true);
        },
        onPostGI: function () {
            var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");

            oCrossAppNav.toExternal({
                target: {
                    semanticObject: "OutboundDelivery",
                    action: "changeInWebGUI"
                },
                params: {
                    "OutboundDelivery": this.getView().getModel("detail").getProperty("/DeliveryNumber")
                }
            });

        },
        // onCreateDelivery: function () {
        //     var oModel = this.getOwnerComponent().getModel();
        //     var oData = this.getView().getModel("detail").getData();
        //     var stoNumber = oData.STONumber;
        //     var itemNo = String(oData.STOItem).padStart(5, "0");
        //     console.log(stoNumber, itemNo);
        //     var that = this;
        //     oModel.callFunction("/CreateDocument", {
        //         method: "POST",
        //         urlParameters: {
        //             STONumber: stoNumber,
        //             STOItem: itemNo
        //         },
        //         success: function (oData) {
        //             sap.m.MessageBox.success(
        //                 "Delivery " + oData.DeliveryNumber + " created successfully.",
        //                 {
        //                     onClose: function () {
        //                         that._loadDashboardData(stoNumber);
        //                     }
        //                 }
        //             );
        //         },
        //         error: function (oError) {
        //             var sMessage = "An error occurred.";

        //             try {
        //                 var oResponse = JSON.parse(oError.responseText);

        //                 if (oResponse.error &&
        //                     oResponse.error.innererror &&
        //                     oResponse.error.innererror.errordetails &&
        //                     oResponse.error.innererror.errordetails.length > 0) {

        //                     sMessage = oResponse.error.innererror.errordetails
        //                         .map(function (oDetail) {
        //                             return oDetail.message;
        //                         })
        //                         .join("\n");
        //                 } else if (oResponse.error && oResponse.error.message) {
        //                     sMessage = oResponse.error.message.value;
        //                 }
        //             } catch (e) {
        //                 sMessage = oError.message || "Unknown error";
        //             }

        //             sap.m.MessageBox.error(sMessage);
        //         }
        //     });
        // }
        onCreateDelivery: function () {
            this._callDocumentAPI("DeliveryNumber", "Delivery");
        },

        onPostGR: function () {
            this._callDocumentAPI("GRMatDocNumber", "GR Document");
        },

        onPostBilling: function () {
            this._callDocumentAPI("BillingDocument", "Billing Document");
        },

        onPostInvoice: function () {
            this._callDocumentAPI("InvoiceDocument", "Invoice Document");
        },
        _callDocumentAPI: function (sDocField, sDocText) {
            this.getView().setBusy(true);
            var oModel = this.getOwnerComponent().getModel();
            var oData = this.getView().getModel("detail").getData();
            var stoNumber = oData.STONumber;
            var itemNo = String(oData.STOItem).padStart(5, "0");
            var that = this;

            oModel.callFunction("/CreateDocument", {
                method: "POST",
                urlParameters: {
                    STONumber: stoNumber,
                    STOItem: itemNo
                },
                success: function (oResponse) {
                    that.getView().setBusy(false);
                    sap.m.MessageBox.success(
                        sDocText + " " + oResponse[sDocField] + " created successfully.",
                        {
                            onClose: function () {
                                that._loadDashboardData(stoNumber);
                            }
                        }
                    );
                },
                error: function (oError) {
                    var sMessage = "An error occurred.";

                    try {
                        var oResponse = JSON.parse(oError.responseText);

                        if (oResponse.error &&
                            oResponse.error.innererror &&
                            oResponse.error.innererror.errordetails &&
                            oResponse.error.innererror.errordetails.length > 0) {

                            sMessage = oResponse.error.innererror.errordetails
                                .map(function (oDetail) {
                                    return oDetail.message;
                                })
                                .join("\n");
                        } else if (oResponse.error && oResponse.error.message) {
                            sMessage = oResponse.error.message.value;
                        }
                    } catch (e) {
                        sMessage = oError.message || "Unknown error";
                    }
                    that.getView().setBusy(false);
                    sap.m.MessageBox.error(sMessage);
                }
            });
        },
    });
});