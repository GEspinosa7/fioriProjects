sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("numen.t21.apps.orders.controller.Master", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();

            },

            onSearch: function (oEvent) {
                let oFilter = new sap.ui.model.Filter("ShipCountry", sap.ui.model.FilterOperator.Contains, oEvent.getParameter("query"));

                this.getView().byId("tableOrders").getBinding("items").filter([
                    oFilter
                ], "Application");
            },

            onListPressItem: function (oEvent) {
                let sOrder = oEvent.getSource().getBindingContext().getPath().substr(8, 5);

                this.oRouter.navTo("detail", { order: sOrder }, true);
            }
        });
    });
