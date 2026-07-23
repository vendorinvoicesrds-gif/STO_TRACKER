// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator"
// ], function (Controller, JSONModel, Filter, FilterOperator) {
//     "use strict";
//     var STAGE_COLUMNS = {
//         "STO List": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "ProcessType", "CreatedOn", "CurrentStage"],
//         "Open STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
//         "Delivery Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM","ProcessType", "CurrentStage"],
//         "PGI Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "PlannedGoodsMovementDate", "AgingDays", "ActualGoodsMovementDate", "ProcessType", "CurrentStage"],
//         "GR Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty",  "UoM","PGIPostingDate", "ProcessType", "CurrentStage"],
//         "Billing Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty",  "UoM","BillingNetAmount", "Currency","ProcessType", "CurrentStage"],
//         "Invoice Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "BillingNetAmount", "Currency","ProcessType", "CurrentStage"],
//         "Completed STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OrderedQty", "OpenQty",  "UoM","ProcessType", "CurrentStage"],
//         "Overdue STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "AgingDays", "PlannedGoodsMovementDate", "DeliveryDate", "ProcessType", "CurrentStage"]
//     };
//     return Controller.extend("stolifecycle.controller.dashboard", {

//         onInit: function () {

//             var oDashboardModel = new JSONModel({
//                 CurrentStage: "STO List",
//                 counts: {
//                     TOTAL_STOS: 0,
//                     OPEN_STOS: 0,
//                     DELIVERY_PENDING: 0,
//                     WM_PENDING: 0,
//                     PGI_PENDING: 0,
//                     TRANSIT_AGING: 0,
//                     GR_PENDING: 0,
//                     BILLING_PENDING: 0,
//                     ACCOUNTING_FAILED: 0,
//                     INVOICE_BLOCKED: 0,
//                     COMPLETED: 0,
//                     CHAIN_EXCEPTIONS: 0,
//                     AGED_STOS: 0
//                 }
//             });

//             this.getView().setModel(oDashboardModel, "dashboard");
//             this.loadDashboardCounts();

//             this.getOwnerComponent()
//                 .getRouter()
//                 .getRoute("Routedashboard")
//                 .attachPatternMatched(this._onRouteMatched, this);

//         },

//         _onRouteMatched: function (oEvent) {
//             this._bStageChanged = true;
//             this.loadDashboardCounts();
//         },

//         // loadDashboardCounts: function () {

//         //     var oModel = this.getOwnerComponent().getModel();
//         //     var that = this;

//         //     oModel.read("/Stats", {
//         //         success: function (oData) {

//         //             var oCounts = {
//         //                 TOTAL_STOS: 0,
//         //                 OPEN_STOS: 0,
//         //                 DELIVERY_PENDING: 0,
//         //                 PGI_PENDING: 0,
//         //                 GR_PENDING: 0,
//         //                 BILLING_PENDING: 0,
//         //                 ACCOUNTING_FAILED: 0,
//         //                 INVOICE_BLOCKED: 0,
//         //                 COMPLETED: 0,
//         //                 AGED_STOS: 0
//         //             };
//         //             oModel.read("/Dashboard/$count", {
//         //                 urlParameters: {
//         //                     "$filter": "AgingDays gt 0"
//         //                 },
//         //                 success: function (oCount) {
//         //                     oCounts.AGED_STOS =  parseInt(oCount, 10) || 0;
//         //                     that.getView().getModel("dashboardModel").setProperty("/Counts", oCounts);
//         //                 },
//         //                 error: function (oError) {
//         //                     oCounts.AGED_STOS = 0;
//         //                     console.error("Failed to fetch aged STOs count", oError);
//         //                 }
//         //             });

//         //             oData.results.forEach(function (item) {


//         //                 switch (item.CurrentStage) {
//         //                     case "Billing Pending":
//         //                         oCounts.BILLING_PENDING = item.StageCount;
//         //                         break;

//         //                     case "Delivery Pending":
//         //                         oCounts.DELIVERY_PENDING = item.StageCount;
//         //                         break;

//         //                     case "GR Pending":
//         //                         oCounts.GR_PENDING = item.StageCount;
//         //                         break;

//         //                     case "Picking Pending":
//         //                         oCounts.PGI_PENDING = item.StageCount;
//         //                         break;

//         //                     case "Accounting Failed":
//         //                         oCounts.ACCOUNTING_FAILED = item.StageCount;
//         //                         break;

//         //                     case "Invoice Pending":
//         //                         oCounts.INVOICE_BLOCKED = item.StageCount;
//         //                         break;

//         //                     case "Completed":
//         //                         oCounts.COMPLETED = item.StageCount;
//         //                         break;

//         //                     case "Place Holder":
//         //                         oCounts.PLACE_HOLDER = item.StageCount;
//         //                         break;


//         //                 }

//         //             });
//         //             oCounts.OPEN_STOS = oCounts.DELIVERY_PENDING + oCounts.GR_PENDING + oCounts.BILLING_PENDING + oCounts.PGI_PENDING + oCounts.ACCOUNTING_FAILED + oCounts.INVOICE_BLOCKED;
//         //             oCounts.TOTAL_STOS = oCounts.OPEN_STOS + oCounts.COMPLETED;
//         //             that.getView().getModel("dashboard").setProperty("/counts", oCounts);
//         //             that.getView().setBusy(false);


//         //         }
//         //     });

//         // },
//         loadDashboardCounts: function () {

//             var oModel = this.getOwnerComponent().getModel();
//             var that = this;

//             oModel.read("/Stats", {
//                 success: function (oData) {

//                     var oCounts = {
//                         TOTAL_STOS: 0,
//                         OPEN_STOS: 0,
//                         DELIVERY_PENDING: 0,
//                         PGI_PENDING: 0,
//                         GR_PENDING: 0,
//                         BILLING_PENDING: 0,
//                         ACCOUNTING_FAILED: 0,
//                         INVOICE_BLOCKED: 0,
//                         COMPLETED: 0,
//                         AGED_STOS: 0
//                     };

//                     oData.results.forEach(function (item) {
//                         switch (item.CurrentStage) {
//                             case "Billing Pending":
//                                 oCounts.BILLING_PENDING = item.StageCount;
//                                 break;
//                             case "Delivery Pending":
//                                 oCounts.DELIVERY_PENDING = item.StageCount;
//                                 break;
//                             case "GR Pending":
//                                 oCounts.GR_PENDING = item.StageCount;
//                                 break;
//                             case "Picking Pending":
//                                 oCounts.PGI_PENDING = item.StageCount;
//                                 break;
//                             case "Accounting Failed":
//                                 oCounts.ACCOUNTING_FAILED = item.StageCount;
//                                 break;
//                             case "Invoice Pending":
//                                 oCounts.INVOICE_BLOCKED = item.StageCount;
//                                 break;
//                             case "Completed":
//                                 oCounts.COMPLETED = item.StageCount;
//                                 break;
//                             case "Place Holder":
//                                 oCounts.PLACE_HOLDER = item.StageCount;
//                                 break;
//                         }
//                     });

//                     oCounts.OPEN_STOS = oCounts.DELIVERY_PENDING + oCounts.GR_PENDING + oCounts.BILLING_PENDING
//                         + oCounts.PGI_PENDING + oCounts.ACCOUNTING_FAILED + oCounts.INVOICE_BLOCKED;
//                     oCounts.TOTAL_STOS = oCounts.OPEN_STOS + oCounts.COMPLETED;

//                     // fire $count after everything else is computed
//                     oModel.read("/Dashboard/$count", {
//                         urlParameters: {
//                             "$filter": "AgingDays gt 0"
//                         },
//                         success: function (oCount) {
//                             oCounts.AGED_STOS = parseInt(oCount, 10) || 0;
//                             that.getView().getModel("dashboard").setProperty("/counts", oCounts);
//                             that.getView().setBusy(false);
//                         },
//                         error: function (oError) {
//                             oCounts.AGED_STOS = 0;
//                             console.error("Failed to fetch aged STOs count", oError);
//                             that.getView().getModel("dashboard").setProperty("/counts", oCounts);
//                             that.getView().setBusy(false);
//                         }
//                     });
//                 },
//                 error: function (oError) {
//                     console.error("Failed to fetch dashboard stats", oError);
//                     that.getView().setBusy(false);
//                 }
//             });

//         },
//         onSearch: function () {
//         },

//         onTilePress: function (oEvent) {

//             var sTitle = oEvent.getSource()
//                 .getTileContent()[0]
//                 .getContent()
//                 .getItems()[1]
//                 .getText();

//             switch (sTitle) {
//                 case "DELIVERY PENDING":
//                     this._sCurrentStage = "Delivery Pending";
//                     break;

//                 case "PGI PENDING":
//                     this._sCurrentStage = "Picking Pending";
//                     break;

//                 case "GR PENDING":
//                     this._sCurrentStage = "GR Pending";
//                     break;

//                 case "BILLING PENDING (IC)":
//                     this._sCurrentStage = "Billing Pending";
//                     break;

//                 case "ACCOUNTING FAILED (IC)":
//                     this._sCurrentStage = "Accounting Failed";
//                     break;

//                 case "INVOICE PENDING (IC)":
//                     this._sCurrentStage = "Invoice Pending";
//                     break;

//                 case "COMPLETED":
//                     this._sCurrentStage = "Completed";
//                     break;

//                 case "OPEN STOs":
//                     this._sCurrentStage = "Open";
//                     break;
//                 case "OVERDUE STOs":
//                     this._sCurrentStage = "Overdue";
//                     break;

//                 default:
//                     this._sCurrentStage = "";
//             }
//             if (this._sCurrentStage === "Picking Pending") {
//                 var title = "PGI Pending STOs";

//             } else {
//                 title = this._sCurrentStage ? this._sCurrentStage + ' STOs' : "STO List";

//             }
//             this.getView().getModel("dashboard").setProperty("/CurrentStage", title);
//             this._bStageChanged = true;
//             this.byId("smartTable").rebindTable();
//         },
//         _applyColumnVisibility: function (sStageTitle) {
//             var aVisibleFields = STAGE_COLUMNS[sStageTitle] || STAGE_COLUMNS["STO List"];
//             var oTable = this.byId("smartTable").getTable();

//             oTable.getColumns().forEach(function (oColumn) {
//                 var sColumnKey;
//                 oColumn.getCustomData().forEach(function (oData) {
//                     if (oData.getKey() === "p13nData") {
//                         var vValue = oData.getValue();
//                         try {
//                             var oP13nData = (typeof vValue === "string") ? JSON.parse(vValue) : vValue;
//                             sColumnKey = oP13nData.columnKey;
//                         } catch (e) {
//                             console.error("Failed to read p13nData for column", oColumn.getId(), e);
//                         }
//                     }
//                 });
//                 if (sColumnKey) {
//                     oColumn.setVisible(aVisibleFields.indexOf(sColumnKey) > -1);
//                 }
//             });
//         },
//         onSmartTableInitialise: function () {

//             var oTable = this.getView().byId("smartTable").getTable();

//             oTable.setSelectionMode("Single");
//             oTable.setSelectionBehavior("Row");

//             oTable.attachRowSelectionChange(this.onRowPress, this);
//         },

//         onBeforeRebindTable: function (oEvent) {

//             var mBindingParams = oEvent.getParameter("bindingParams");
//             var sTitle = this.getView().getModel("dashboard").getProperty("/CurrentStage");
//             if (this._bStageChanged) {
//                 this._applyColumnVisibility(sTitle);
//                 var aFields = STAGE_COLUMNS[sTitle] || STAGE_COLUMNS["STO List"];
//                 mBindingParams.parameters = mBindingParams.parameters || {};
//                 mBindingParams.parameters.select = aFields.join(",");
//                 this._bStageChanged = false;
//             }

//             // this._applyColumnVisibility(sTitle);

//             // var aFields = STAGE_COLUMNS[sTitle] || STAGE_COLUMNS["STO List"];
//             // mBindingParams.parameters = mBindingParams.parameters || {};
//             // mBindingParams.parameters.select = aFields.join(",");

            

//             if (this._sCurrentStage) {

//                 if (this._sCurrentStage === "Open") {

//                     var aOpenFilters = [
//                         new Filter("CurrentStage", FilterOperator.EQ, "Delivery Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "Picking Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "GR Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "Billing Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "Invoice Pending")
//                     ];

//                     mBindingParams.filters.push(
//                         new Filter({
//                             filters: aOpenFilters,
//                             and: false
//                         })
//                     );

//                 } else if (this._sCurrentStage === "Overdue") {
//                     var oFilter = new sap.ui.model.Filter(
//                         "AgingDays",
//                         sap.ui.model.FilterOperator.GT,
//                         0
//                     );
//                     mBindingParams.filters.push(oFilter);

//                 }
//                 else {
//                     var oFilter = new sap.ui.model.Filter(
//                         "CurrentStage",
//                         sap.ui.model.FilterOperator.EQ,
//                         this._sCurrentStage
//                     );
//                     mBindingParams.filters.push(oFilter);

//                 }
//             }
//         },
//         onRowPress: function (oEvent) {
//             var oTable = this.getView().byId("smartTable").getTable();
//             var iIndex = oEvent.getParameter("rowIndex");

//             var oContext = oTable.getContextByIndex(iIndex);
//             if (!oContext) {
//                 return;
//             }
//             var oData = oContext.getObject();
//             console.log(oData);
//             this.getView().setBusy(true);
//             this.getOwnerComponent().getRouter().navTo(
//                 "Routelifecycledrilldown",
//                 {
//                     STOData: encodeURIComponent(JSON.stringify(oData))
//                 }
//             );
//         }

//     });
// });


// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/json/JSONModel",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator"
// ], function (Controller, JSONModel, Filter, FilterOperator) {
//     "use strict";

//     var STAGE_COLUMNS = {
//         "STO List": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "ProcessType", "CreatedOn", "CurrentStage"],
//         "Open STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
//         "Delivery Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
//         "PGI Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "PlannedGoodsMovementDate", "AgingDays", "ActualGoodsMovementDate", "ProcessType", "CurrentStage"],
//         "GR Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "PGIPostingDate", "ProcessType", "CurrentStage"],
//         "Billing Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "BillingNetAmount", "Currency", "ProcessType", "CurrentStage"],
//         "Invoice Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "BillingNetAmount", "Currency", "ProcessType", "CurrentStage"],
//         "Completed STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OrderedQty", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
//         "Overdue STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "AgingDays", "PlannedGoodsMovementDate", "DeliveryDate", "ProcessType", "CurrentStage"]
//     };

//     return Controller.extend("stolifecycle.controller.dashboard", {

//         onInit: function () {

//             var oDashboardModel = new JSONModel({
//                 CurrentStage: "STO List",
//                 counts: {
//                     TOTAL_STOS: 0,
//                     OPEN_STOS: 0,
//                     DELIVERY_PENDING: 0,
//                     WM_PENDING: 0,
//                     PGI_PENDING: 0,
//                     TRANSIT_AGING: 0,
//                     GR_PENDING: 0,
//                     BILLING_PENDING: 0,
//                     ACCOUNTING_FAILED: 0,
//                     INVOICE_BLOCKED: 0,
//                     COMPLETED: 0,
//                     CHAIN_EXCEPTIONS: 0,
//                     AGED_STOS: 0
//                 }
//             });

//             this.getView().setModel(oDashboardModel, "dashboard");
//             this._oUnitFieldCache = {};

//             // Ensure the very first autobind also gets stage-column visibility/order applied
//             this._bStageChanged = true;

//             this.loadDashboardCounts();

//             this.getOwnerComponent()
//                 .getRouter()
//                 .getRoute("Routedashboard")
//                 .attachPatternMatched(this._onRouteMatched, this);

//         },

//         _onRouteMatched: function (oEvent) {
//             this._bStageChanged = true;
//             this.loadDashboardCounts();
//         },

//         /**
//          * Resolves the sap:unit / sap:semantics unit-of-measure or currency field
//          * for a given property, straight from OData $metadata (cached after first lookup).
//          * This means a change to the RAP/CDS annotation is picked up automatically
//          * with no frontend code changes.
//          */
//         _getUnitField: function (sColumnKey) {

//             if (this._oUnitFieldCache.hasOwnProperty(sColumnKey)) {
//                 return this._oUnitFieldCache[sColumnKey];
//             }

//             var oModel = this.getOwnerComponent().getModel();
//             var oMetaModel = oModel.getMetaModel ? oModel.getMetaModel() : null;
//             var sUnitField = null;

//             if (oMetaModel) {
//                 var oEntitySet = oMetaModel.getODataEntitySet("Dashboard");
//                 var oEntityType = oEntitySet && oMetaModel.getODataEntityType(oEntitySet.entityType);
//                 var oProperty = oEntityType && oMetaModel.getODataProperty(oEntityType, sColumnKey);

//                 sUnitField = (oProperty && oProperty["sap:unit"]) || null;
//             }

//             this._oUnitFieldCache[sColumnKey] = sUnitField;
//             return sUnitField;
//         },

//         loadDashboardCounts: function () {

//             var oModel = this.getOwnerComponent().getModel();
//             var that = this;

//             oModel.read("/Stats", {
//                 success: function (oData) {

//                     var oCounts = {
//                         TOTAL_STOS: 0,
//                         OPEN_STOS: 0,
//                         DELIVERY_PENDING: 0,
//                         PGI_PENDING: 0,
//                         GR_PENDING: 0,
//                         BILLING_PENDING: 0,
//                         ACCOUNTING_FAILED: 0,
//                         INVOICE_BLOCKED: 0,
//                         COMPLETED: 0,
//                         AGED_STOS: 0
//                     };

//                     oData.results.forEach(function (item) {
//                         switch (item.CurrentStage) {
//                             case "Billing Pending":
//                                 oCounts.BILLING_PENDING = item.StageCount;
//                                 break;
//                             case "Delivery Pending":
//                                 oCounts.DELIVERY_PENDING = item.StageCount;
//                                 break;
//                             case "GR Pending":
//                                 oCounts.GR_PENDING = item.StageCount;
//                                 break;
//                             case "Picking Pending":
//                                 oCounts.PGI_PENDING = item.StageCount;
//                                 break;
//                             case "Accounting Failed":
//                                 oCounts.ACCOUNTING_FAILED = item.StageCount;
//                                 break;
//                             case "Invoice Pending":
//                                 oCounts.INVOICE_BLOCKED = item.StageCount;
//                                 break;
//                             case "Completed":
//                                 oCounts.COMPLETED = item.StageCount;
//                                 break;
//                             case "Place Holder":
//                                 oCounts.PLACE_HOLDER = item.StageCount;
//                                 break;
//                         }
//                     });

//                     oCounts.OPEN_STOS = oCounts.DELIVERY_PENDING + oCounts.GR_PENDING + oCounts.BILLING_PENDING
//                         + oCounts.PGI_PENDING + oCounts.ACCOUNTING_FAILED + oCounts.INVOICE_BLOCKED;
//                     oCounts.TOTAL_STOS = oCounts.OPEN_STOS + oCounts.COMPLETED;

//                     // fire $count after everything else is computed
//                     oModel.read("/Dashboard/$count", {
//                         urlParameters: {
//                             "$filter": "AgingDays gt 0"
//                         },
//                         success: function (oCount) {
//                             oCounts.AGED_STOS = parseInt(oCount, 10) || 0;
//                             that.getView().getModel("dashboard").setProperty("/counts", oCounts);
//                             that.getView().setBusy(false);
//                         },
//                         error: function (oError) {
//                             oCounts.AGED_STOS = 0;
//                             console.error("Failed to fetch aged STOs count", oError);
//                             that.getView().getModel("dashboard").setProperty("/counts", oCounts);
//                             that.getView().setBusy(false);
//                         }
//                     });
//                 },
//                 error: function (oError) {
//                     console.error("Failed to fetch dashboard stats", oError);
//                     that.getView().setBusy(false);
//                 }
//             });

//         },

//         onSearch: function () {
//         },

//         onTilePress: function (oEvent) {

//             var sTitle = oEvent.getSource()
//                 .getTileContent()[0]
//                 .getContent()
//                 .getItems()[1]
//                 .getText();

//             switch (sTitle) {
//                 case "DELIVERY PENDING":
//                     this._sCurrentStage = "Delivery Pending";
//                     break;

//                 case "PGI PENDING":
//                     this._sCurrentStage = "Picking Pending";
//                     break;

//                 case "GR PENDING":
//                     this._sCurrentStage = "GR Pending";
//                     break;

//                 case "BILLING PENDING (IC)":
//                     this._sCurrentStage = "Billing Pending";
//                     break;

//                 case "ACCOUNTING FAILED (IC)":
//                     this._sCurrentStage = "Accounting Failed";
//                     break;

//                 case "INVOICE PENDING (IC)":
//                     this._sCurrentStage = "Invoice Pending";
//                     break;

//                 case "COMPLETED":
//                     this._sCurrentStage = "Completed";
//                     break;

//                 case "OPEN STOs":
//                     this._sCurrentStage = "Open";
//                     break;

//                 case "OVERDUE STOs":
//                     this._sCurrentStage = "Overdue";
//                     break;

//                 default:
//                     this._sCurrentStage = "";
//             }

//             var title;
//             if (this._sCurrentStage === "Picking Pending") {
//                 title = "PGI Pending STOs";
//             } else {
//                 title = this._sCurrentStage ? this._sCurrentStage + ' STOs' : "STO List";
//             }

//             this.getView().getModel("dashboard").setProperty("/CurrentStage", title);
//             this._bStageChanged = true;
//             this.byId("smartTable").rebindTable();
//         },

//         /**
//          * Shows/hides columns for the given stage, AND reorders visible columns
//          * to match the order defined in STAGE_COLUMNS. This runs only on stage
//          * changes (tile press / route match), never on a Settings/p13n-triggered
//          * rebind, so manual user reordering via Settings is left alone in between
//          * tile presses.
//          */
//         _applyColumnVisibility: function (sStageTitle) {
//             var aVisibleFields = STAGE_COLUMNS[sStageTitle] || STAGE_COLUMNS["STO List"];
//             var oTable = this.byId("smartTable").getTable();

//             oTable.getColumns().forEach(function (oColumn) {
//                 var sColumnKey;
//                 oColumn.getCustomData().forEach(function (oData) {
//                     if (oData.getKey() === "p13nData") {
//                         var vValue = oData.getValue();
//                         try {
//                             var oP13nData = (typeof vValue === "string") ? JSON.parse(vValue) : vValue;
//                             sColumnKey = oP13nData.columnKey;
//                         } catch (e) {
//                             console.error("Failed to read p13nData for column", oColumn.getId(), e);
//                         }
//                     }
//                 });

//                 if (sColumnKey) {
//                     var iWantedIndex = aVisibleFields.indexOf(sColumnKey);
//                     oColumn.setVisible(iWantedIndex > -1);

//                     if (iWantedIndex > -1) {
//                         oTable.removeColumn(oColumn);
//                         oTable.insertColumn(oColumn, iWantedIndex);
//                     }
//                 }
//             });
//         },

//         onSmartTableInitialise: function () {

//             var oTable = this.getView().byId("smartTable").getTable();

//             oTable.setSelectionMode("Single");
//             oTable.setSelectionBehavior("Row");

//             oTable.attachRowSelectionChange(this.onRowPress, this);
//         },

//         onBeforeRebindTable: function (oEvent) {

//             var mBindingParams = oEvent.getParameter("bindingParams");
//             var sTitle = this.getView().getModel("dashboard").getProperty("/CurrentStage");
//             var oTable = this.byId("smartTable").getTable();
//             var that = this;

//             // Only touch column visibility/order on a stage-driven rebind
//             // (tile press / route match). Settings/p13n-driven rebinds leave
//             // the user's own choices untouched.
//             if (this._bStageChanged) {
//                 this._applyColumnVisibility(sTitle);
//                 this._bStageChanged = false;
//             }

//             // Build $select from whatever columns are actually visible right now,
//             // in their current displayed order — reflects either the stage-driven
//             // order just applied above, or the user's own Settings/p13n order.
//             var aSelectFields = [];

//             oTable.getColumns()
//                 .slice()
//                 .sort(function (a, b) {
//                     return oTable.indexOfColumn(a) - oTable.indexOfColumn(b);
//                 })
//                 .forEach(function (oColumn) {
//                     if (!oColumn.getVisible()) {
//                         return;
//                     }

//                     var sColumnKey;
//                     oColumn.getCustomData().forEach(function (oData) {
//                         if (oData.getKey() === "p13nData") {
//                             var vValue = oData.getValue();
//                             try {
//                                 var oP13nData = (typeof vValue === "string") ? JSON.parse(vValue) : vValue;
//                                 sColumnKey = oP13nData.leadingProperty || oP13nData.columnKey;
//                             } catch (e) {
//                                 console.error("Failed to read p13nData for column", oColumn.getId(), e);
//                             }
//                         }
//                     });

//                     if (sColumnKey && aSelectFields.indexOf(sColumnKey) === -1) {
//                         aSelectFields.push(sColumnKey);

//                         var sUnitField = that._getUnitField(sColumnKey);
//                         if (sUnitField && aSelectFields.indexOf(sUnitField) === -1) {
//                             aSelectFields.push(sUnitField);
//                         }
//                     }
//                 });

//             // Always guarantee key fields, even if hidden, for row identification / navigation
//             ["STONumber", "STOItem"].forEach(function (sKeyField) {
//                 if (aSelectFields.indexOf(sKeyField) === -1) {
//                     aSelectFields.push(sKeyField);
//                 }
//             });

//             if (aSelectFields.length) {
//                 mBindingParams.parameters = mBindingParams.parameters || {};
//                 mBindingParams.parameters.select = aSelectFields.join(",");
//                 console.log("Computed $select:", mBindingParams.parameters.select);
//             } else {
//                 console.warn("aSelectFields empty — no select applied, fallback fetch will occur");
//             }

//             if (this._sCurrentStage) {

//                 if (this._sCurrentStage === "Open") {

//                     var aOpenFilters = [
//                         new Filter("CurrentStage", FilterOperator.EQ, "Delivery Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "Picking Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "GR Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "Billing Pending"),
//                         new Filter("CurrentStage", FilterOperator.EQ, "Invoice Pending")
//                     ];

//                     mBindingParams.filters.push(
//                         new Filter({
//                             filters: aOpenFilters,
//                             and: false
//                         })
//                     );

//                 } else if (this._sCurrentStage === "Overdue") {
//                     var oFilter = new sap.ui.model.Filter(
//                         "AgingDays",
//                         sap.ui.model.FilterOperator.GT,
//                         0
//                     );
//                     mBindingParams.filters.push(oFilter);

//                 } else {
//                     var oStageFilter = new sap.ui.model.Filter(
//                         "CurrentStage",
//                         sap.ui.model.FilterOperator.EQ,
//                         this._sCurrentStage
//                     );
//                     mBindingParams.filters.push(oStageFilter);
//                 }
//             }
//         },

//         onRowPress: function (oEvent) {
//             var oTable = this.getView().byId("smartTable").getTable();
//             var iIndex = oEvent.getParameter("rowIndex");

//             var oContext = oTable.getContextByIndex(iIndex);
//             if (!oContext) {
//                 return;
//             }
//             var oData = oContext.getObject();
//             console.log(oData);
//             this.getView().setBusy(true);
//             this.getOwnerComponent().getRouter().navTo(
//                 "Routelifecycledrilldown",
//                 {
//                     STOData: encodeURIComponent(JSON.stringify(oData))
//                 }
//             );
//         }

//     });
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    var STAGE_COLUMNS = {
        "STO List": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "ProcessType", "CreatedOn", "CurrentStage"],
        "Open STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
        "Delivery Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
        "PGI Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "PlannedGoodsMovementDate", "AgingDays", "ActualGoodsMovementDate", "ProcessType", "CurrentStage"],
        "GR Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "PGIPostingDate", "ProcessType", "CurrentStage"],
        "Billing Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "BillingNetAmount", "Currency", "ProcessType", "CurrentStage"],
        "Invoice Pending STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OpenQty", "UoM", "BillingNetAmount", "Currency", "ProcessType", "CurrentStage"],
        "Completed STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "OrderedQty", "OpenQty", "UoM", "ProcessType", "CurrentStage"],
        "Overdue STOs": ["STONumber", "STOItem", "Material", "MaterialDesc", "SupplyingPlant", "ReceivingPlant", "AgingDays", "PlannedGoodsMovementDate", "DeliveryDate", "ProcessType", "CurrentStage"]
    };

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
            this._oUnitFieldCache = {};

            // Ensure the very first autobind also gets stage-column visibility/order applied
            this._bStageChanged = true;

            this.loadDashboardCounts();

            this.getOwnerComponent()
                .getRouter()
                .getRoute("Routedashboard")
                .attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched: function (oEvent) {
            this._bStageChanged = true;
            this.loadDashboardCounts();
        },

        /**
         * Resolves the sap:unit / sap:semantics unit-of-measure or currency field
         * for a given property, straight from OData $metadata (cached after first lookup).
         * This means a change to the RAP/CDS annotation is picked up automatically
         * with no frontend code changes.
         */
        _getUnitField: function (sColumnKey) {

            if (this._oUnitFieldCache.hasOwnProperty(sColumnKey)) {
                return this._oUnitFieldCache[sColumnKey];
            }

            var oModel = this.getOwnerComponent().getModel();
            var oMetaModel = oModel.getMetaModel ? oModel.getMetaModel() : null;
            var sUnitField = null;

            if (oMetaModel) {
                var oEntitySet = oMetaModel.getODataEntitySet("Dashboard");
                var oEntityType = oEntitySet && oMetaModel.getODataEntityType(oEntitySet.entityType);
                var oProperty = oEntityType && oMetaModel.getODataProperty(oEntityType, sColumnKey);

                sUnitField = (oProperty && oProperty["sap:unit"]) || null;
            }

            this._oUnitFieldCache[sColumnKey] = sUnitField;
            return sUnitField;
        },

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

                case "OVERDUE STOs":
                    this._sCurrentStage = "Overdue";
                    break;

                default:
                    this._sCurrentStage = "";
            }

            var title;
            if (this._sCurrentStage === "Picking Pending") {
                title = "PGI Pending STOs";
            } else {
                title = this._sCurrentStage ? this._sCurrentStage + ' STOs' : "STO List";
            }

            this.getView().getModel("dashboard").setProperty("/CurrentStage", title);
            this._bStageChanged = true;
            this.byId("smartTable").rebindTable();
        },

        /**
         * Shows/hides and reorders columns for the given stage via
         * SmartTable.applyVariant(). This is important: directly calling
         * oColumn.setVisible()/removeColumn()/insertColumn() only changes what's
         * rendered — it does NOT update SmartTable's internal personalization
         * (p13n) model, so the Settings dialog keeps showing the old state and
         * can even revert your changes when opened/closed. applyVariant() writes
         * straight into that same personalization controller, so the Settings
         * dialog and the table stay in sync.
         *
         * This runs only on stage changes (tile press / route match), never on a
         * Settings/p13n-triggered rebind, so manual user reordering via Settings
         * is left alone in between tile presses.
         */
        _applyColumnVisibility: function (sStageTitle) {
            var aVisibleFields = STAGE_COLUMNS[sStageTitle] || STAGE_COLUMNS["STO List"];
            var oSmartTable = this.byId("smartTable");
            var oTable = oSmartTable.getTable();

            var aColumnsItems = [];
            var iHiddenIndex = aVisibleFields.length;

            oTable.getColumns().forEach(function (oColumn) {
                var sColumnKey;
                oColumn.getCustomData().forEach(function (oData) {
                    if (oData.getKey() === "p13nData") {
                        var vValue = oData.getValue();
                        try {
                            var oP13nData = (typeof vValue === "string") ? JSON.parse(vValue) : vValue;
                            sColumnKey = oP13nData.columnKey;
                        } catch (e) {
                            console.error("Failed to read p13nData for column", oColumn.getId(), e);
                        }
                    }
                });

                if (!sColumnKey) {
                    return;
                }

                var iWantedIndex = aVisibleFields.indexOf(sColumnKey);

                if (iWantedIndex > -1) {
                    aColumnsItems.push({ columnKey: sColumnKey, visible: true, index: iWantedIndex });
                } else {
                    aColumnsItems.push({ columnKey: sColumnKey, visible: false, index: iHiddenIndex++ });
                }
            });

            oSmartTable.applyVariant({
                columns: {
                    columnsItems: aColumnsItems
                }
            });
        },

        onSmartTableInitialise: function () {

            var oTable = this.getView().byId("smartTable").getTable();

            oTable.setSelectionMode("Single");
            oTable.setSelectionBehavior("Row");

            oTable.attachRowSelectionChange(this.onRowPress, this);
            oTable.attachRowsUpdated(function () {
                oTable.getColumns().forEach(function (oColumn, iIndex) {
                    oTable.autoResizeColumn(iIndex);
                });
            });

        },

        onBeforeRebindTable: function (oEvent) {

            var mBindingParams = oEvent.getParameter("bindingParams");
            var sTitle = this.getView().getModel("dashboard").getProperty("/CurrentStage");
            var oTable = this.byId("smartTable").getTable();
            var that = this;

            // Only touch column visibility/order on a stage-driven rebind
            // (tile press / route match). Settings/p13n-driven rebinds leave
            // the user's own choices untouched.
            if (this._bStageChanged) {
                this._applyColumnVisibility(sTitle);
                this._bStageChanged = false;
            }

            // Build $select from whatever columns are actually visible right now,
            // in their current displayed order — reflects either the stage-driven
            // order just applied above, or the user's own Settings/p13n order.
            var aSelectFields = [];

            oTable.getColumns()
                .slice()
                .sort(function (a, b) {
                    return oTable.indexOfColumn(a) - oTable.indexOfColumn(b);
                })
                .forEach(function (oColumn) {
                    if (!oColumn.getVisible()) {
                        return;
                    }

                    var sColumnKey;
                    oColumn.getCustomData().forEach(function (oData) {
                        if (oData.getKey() === "p13nData") {
                            var vValue = oData.getValue();
                            try {
                                var oP13nData = (typeof vValue === "string") ? JSON.parse(vValue) : vValue;
                                sColumnKey = oP13nData.leadingProperty || oP13nData.columnKey;
                            } catch (e) {
                                console.error("Failed to read p13nData for column", oColumn.getId(), e);
                            }
                        }
                    });

                    if (sColumnKey && aSelectFields.indexOf(sColumnKey) === -1) {
                        aSelectFields.push(sColumnKey);

                        var sUnitField = that._getUnitField(sColumnKey);
                        if (sUnitField && aSelectFields.indexOf(sUnitField) === -1) {
                            aSelectFields.push(sUnitField);
                        }
                    }
                });

            // Always guarantee key fields, even if hidden, for row identification / navigation
            ["STONumber", "STOItem"].forEach(function (sKeyField) {
                if (aSelectFields.indexOf(sKeyField) === -1) {
                    aSelectFields.push(sKeyField);
                }
            });

            if (aSelectFields.length) {
                mBindingParams.parameters = mBindingParams.parameters || {};
                mBindingParams.parameters.select = aSelectFields.join(",");
                console.log("Computed $select:", mBindingParams.parameters.select);
            } else {
                console.warn("aSelectFields empty — no select applied, fallback fetch will occur");
            }

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

                } else if (this._sCurrentStage === "Overdue") {
                    var oFilter = new sap.ui.model.Filter(
                        "AgingDays",
                        sap.ui.model.FilterOperator.GT,
                        0
                    );
                    mBindingParams.filters.push(oFilter);

                } else {
                    var oStageFilter = new sap.ui.model.Filter(
                        "CurrentStage",
                        sap.ui.model.FilterOperator.EQ,
                        this._sCurrentStage
                    );
                    mBindingParams.filters.push(oStageFilter);
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