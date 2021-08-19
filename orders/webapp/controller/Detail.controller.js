sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "numen/t21/apps/orders/util/formatter",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     */

    function (Controller,
        formatter,
        JSONModel,
        FilterOperator,
        Sorter) {
        "use strict";

        return Controller.extend("numen.t21.apps.orders.controller.Detail", {
            formatter: formatter,

            oJson: {Data: undefined, Invoices: []},

            onInit: function () {
                this.oModel = this.getOwnerComponent().getModel();
                this.oModel.attachRequestCompleted(function (oResponse) {
                    if (oResponse.getParameter("method").toUpperCase() == "GET") {
                        let oResults = JSON.parse(oResponse.getParameter("response").responseText).d.results;

                        if (oResponse.getParameter('url').indexOf("Orders") > -1)
                            this.processData(oResults);

                        if (oResponse.getParameter('url').indexOf("Invoices") > -1)
                            this.processInvoices(oResults);
                        
                    }
                    else
                        sap.m.MessageToast.show("Erro na comunicação");
                }, this);

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("master").attachPatternMatched(this.onOrderMatched, this);
                this.oRouter.getRoute("detail").attachPatternMatched(this.onOrderMatched, this);
            },

            onOrderMatched: function (oEvent) {
                this.sOrder = oEvent.getParameter("arguments").order;

                this.getData();
                this.getInvoices();
            },

            getData: function () {
                let oFilters = []
                oFilters.push(new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, this.sOrder));
                this.oModel.read("/Orders", {
                    filters: oFilters,
                    urlParameters: { "$expand" : "Customer,Shipper" }
                });
            },

            processData: function (oJson) {
                this.oJson.Data = oJson[0];
                let oModel = new JSONModel(this.oJson);

                this.getView().setModel(oModel);
            },

            getInvoices: function() {
                let oFilters = [];

                oFilters.push(new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, this.sOrder));

                this.oModel.read("/Invoices", {
                    filters: oFilters,
                });
            },

            processInvoices: function (oJson) {
                this.oJson.Invoices = oJson;
                let oModel = new JSONModel(this.oJson);

                this.getView().setModel(oModel);
            }
        })
    }

)