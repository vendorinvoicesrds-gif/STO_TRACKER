sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("stolifecycle.controller.dashboard", {

        onInit: function () {

            var oDashboardModel = new JSONModel({
                CurrentStage: "STO List",
                counts: {
                    TOTAL_STOS: 0,
                    OPEN_STOS: 0,
                    DELIVERY_PENDING: 0,
                    WM_PENDING: 0,
                    PGI_PENDING: 0,
                    TRANSIT_AGING: 0,
                    GR_PENDING: 0,
                    BILLING_PENDING: 0,
                    ACCOUNTING_FAILED: 0,
                    INVOICE_BLOCKED: 0,
                    COMPLETED: 0,
                    CHAIN_EXCEPTIONS: 0,
                    AGED_STOS: 0
                }
            });

            this.getView().setModel(oDashboardModel, "dashboard");
            this.loadDashboardCounts();

            this.getOwnerComponent()
                .getRouter()
                .getRoute("Routedashboard")
                .attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function (oEvent) {

            this.loadDashboardCounts();
        },

        // loadDashboardCounts: function () {

        //     var oModel = this.getOwnerComponent().getModel();
        //     var that = this;

        //     oModel.read("/Stats", {
        //         success: function (oData) {

        //             var oCounts = {
        //                 TOTAL_STOS: 0,
        //                 OPEN_STOS: 0,
        //                 DELIVERY_PENDING: 0,
        //                 PGI_PENDING: 0,
        //                 GR_PENDING: 0,
        //                 BILLING_PENDING: 0,
        //                 ACCOUNTING_FAILED: 0,
        //                 INVOICE_BLOCKED: 0,
        //                 COMPLETED: 0,
        //                 AGED_STOS: 0
        //             };
        //             oModel.read("/Dashboard/$count", {
        //                 urlParameters: {
        //                     "$filter": "AgingDays gt 0"
        //                 },
        //                 success: function (oCount) {
        //                     oCounts.AGED_STOS =  parseInt(oCount, 10) || 0;
        //                     that.getView().getModel("dashboardModel").setProperty("/Counts", oCounts);
        //                 },
        //                 error: function (oError) {
        //                     oCounts.AGED_STOS = 0;
        //                     console.error("Failed to fetch aged STOs count", oError);
        //                 }
        //             });

        //             oData.results.forEach(function (item) {


        //                 switch (item.CurrentStage) {
        //                     case "Billing Pending":
        //                         oCounts.BILLING_PENDING = item.StageCount;
        //                         break;

        //                     case "Delivery Pending":
        //                         oCounts.DELIVERY_PENDING = item.StageCount;
        //                         break;

        //                     case "GR Pending":
        //                         oCounts.GR_PENDING = item.StageCount;
        //                         break;

        //                     case "Picking Pending":
        //                         oCounts.PGI_PENDING = item.StageCount;
        //                         break;

        //                     case "Accounting Failed":
        //                         oCounts.ACCOUNTING_FAILED = item.StageCount;
        //                         break;

        //                     case "Invoice Pending":
        //                         oCounts.INVOICE_BLOCKED = item.StageCount;
        //                         break;

        //                     case "Completed":
        //                         oCounts.COMPLETED = item.StageCount;
        //                         break;

        //                     case "Place Holder":
        //                         oCounts.PLACE_HOLDER = item.StageCount;
        //                         break;


        //                 }

        //             });
        //             oCounts.OPEN_STOS = oCounts.DELIVERY_PENDING + oCounts.GR_PENDING + oCounts.BILLING_PENDING + oCounts.PGI_PENDING + oCounts.ACCOUNTING_FAILED + oCounts.INVOICE_BLOCKED;
        //             oCounts.TOTAL_STOS = oCounts.OPEN_STOS + oCounts.COMPLETED;
        //             that.getView().getModel("dashboard").setProperty("/counts", oCounts);
        //             that.getView().setBusy(false);


        //         }
        //     });

        // },
        loadDashboardCounts: function () {

            var oModel = this.getOwnerComponent().getModel();
            var that = this;

            oModel.read("/Stats", {
                success: function (oData) {

                    var oCounts = {
                        TOTAL_STOS: 0,
                        OPEN_STOS: 0,
                        DELIVERY_PENDING: 0,
                        PGI_PENDING: 0,
                        GR_PENDING: 0,
                        BILLING_PENDING: 0,
                        ACCOUNTING_FAILED: 0,
                        INVOICE_BLOCKED: 0,
                        COMPLETED: 0,
                        AGED_STOS: 0
                    };

                    oData.results.forEach(function (item) {
                        switch (item.CurrentStage) {
                            case "Billing Pending":
                                oCounts.BILLING_PENDING = item.StageCount;
                                break;
                            case "Delivery Pending":
                                oCounts.DELIVERY_PENDING = item.StageCount;
                                break;
                            case "GR Pending":
                                oCounts.GR_PENDING = item.StageCount;
                                break;
                            case "Picking Pending":
                                oCounts.PGI_PENDING = item.StageCount;
                                break;
                            case "Accounting Failed":
                                oCounts.ACCOUNTING_FAILED = item.StageCount;
                                break;
                            case "Invoice Pending":
                                oCounts.INVOICE_BLOCKED = item.StageCount;
                                break;
                            case "Completed":
                                oCounts.COMPLETED = item.StageCount;
                                break;
                            case "Place Holder":
                                oCounts.PLACE_HOLDER = item.StageCount;
                                break;
                        }
                    });

                    oCounts.OPEN_STOS = oCounts.DELIVERY_PENDING + oCounts.GR_PENDING + oCounts.BILLING_PENDING
                        + oCounts.PGI_PENDING + oCounts.ACCOUNTING_FAILED + oCounts.INVOICE_BLOCKED;
                    oCounts.TOTAL_STOS = oCounts.OPEN_STOS + oCounts.COMPLETED;

                    // fire $count after everything else is computed
                    oModel.read("/Dashboard/$count", {
                        urlParameters: {
                            "$filter": "AgingDays gt 0"
                        },
                        success: function (oCount) {
                            oCounts.AGED_STOS = parseInt(oCount, 10) || 0;
                            that.getView().getModel("dashboard").setProperty("/counts", oCounts);
                            that.getView().setBusy(false);
                        },
                        error: function (oError) {
                            oCounts.AGED_STOS = 0;
                            console.error("Failed to fetch aged STOs count", oError);
                            that.getView().getModel("dashboard").setProperty("/counts", oCounts);
                            that.getView().setBusy(false);
                        }
                    });
                },
                error: function (oError) {
                    console.error("Failed to fetch dashboard stats", oError);
                    that.getView().setBusy(false);
                }
            });

        },
        onSearch: function () {
        },

        onTilePress: function (oEvent) {

            var sTitle = oEvent.getSource()
                .getTileContent()[0]
                .getContent()
                .getItems()[1]
                .getText();

            switch (sTitle) {
                case "DELIVERY PENDING":
                    this._sCurrentStage = "Delivery Pending";
                    break;

                case "PGI PENDING":
                    this._sCurrentStage = "Picking Pending";
                    break;

                case "GR PENDING":
                    this._sCurrentStage = "GR Pending";
                    break;

                case "BILLING PENDING (IC)":
                    this._sCurrentStage = "Billing Pending";
                    break;

                case "ACCOUNTING FAILED (IC)":
                    this._sCurrentStage = "Accounting Failed";
                    break;

                case "INVOICE PENDING (IC)":
                    this._sCurrentStage = "Invoice Pending";
                    break;

                case "COMPLETED":
                    this._sCurrentStage = "Completed";
                    break;

                case "OPEN STOs":
                    this._sCurrentStage = "Open";
                    break;
                case "AGED STOs":
                    this._sCurrentStage = "Aged";
                    break;

                default:
                    this._sCurrentStage = "";
            }
            if (this._sCurrentStage === "Picking Pending") {
                var title = "PGI Pending STOs";

            } else {
                title = this._sCurrentStage ? this._sCurrentStage + ' STOs' : "STO List";

            }
            this.getView().getModel("dashboard").setProperty("/CurrentStage", title);
            this.byId("smartTable").rebindTable();
        },

        onSmartTableInitialise: function () {

            var oTable = this.getView().byId("smartTable").getTable();

            oTable.setSelectionMode("Single");
            oTable.setSelectionBehavior("Row");

            oTable.attachRowSelectionChange(this.onRowPress, this);
        },

        onBeforeRebindTable: function (oEvent) {

            var mBindingParams = oEvent.getParameter("bindingParams");

            if (this._sCurrentStage) {

                if (this._sCurrentStage === "Open") {

                    var aOpenFilters = [
                        new Filter("CurrentStage", FilterOperator.EQ, "Delivery Pending"),
                        new Filter("CurrentStage", FilterOperator.EQ, "Picking Pending"),
                        new Filter("CurrentStage", FilterOperator.EQ, "GR Pending"),
                        new Filter("CurrentStage", FilterOperator.EQ, "Billing Pending"),
                        new Filter("CurrentStage", FilterOperator.EQ, "Invoice Pending")
                    ];

                    mBindingParams.filters.push(
                        new Filter({
                            filters: aOpenFilters,
                            and: false
                        })
                    );
                } else if (this._sCurrentStage === "Aged") {
                    var oFilter = new sap.ui.model.Filter(
                        "AgingDays",
                        sap.ui.model.FilterOperator.GT,
                        0
                    );
                    mBindingParams.filters.push(oFilter);

                } 
                else {
                    var oFilter = new sap.ui.model.Filter(
                        "CurrentStage",
                        sap.ui.model.FilterOperator.EQ,
                        this._sCurrentStage
                    );
                    mBindingParams.filters.push(oFilter);

                }
            }
        },
        onRowPress: function (oEvent) {
            var oTable = this.getView().byId("smartTable").getTable();
            var iIndex = oEvent.getParameter("rowIndex");

            var oContext = oTable.getContextByIndex(iIndex);
            if (!oContext) {
                return;
            }
            var oData = oContext.getObject();
            console.log(oData);
            this.getView().setBusy(true);
            this.getOwnerComponent().getRouter().navTo(
                "Routelifecycledrilldown",
                {
                    STOData: encodeURIComponent(JSON.stringify(oData))
                }
            );
        }

    });
});