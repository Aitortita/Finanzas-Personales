'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSQLessSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    lastName: String,
    email: { type: String, unique: true, lowercase: true, required: true },
    avatar: String,
    Account: {
        // La cuenta de cada User tiene 4 props: 
        // 1- Es un arreglo de obj/ingresos mensuales.
        // 2- Es un arreglo de obj/ingresos extras.
        // 3- Es un arreglo de obj/gastos mensuales.
        // 4- Es un arreglo de obj/gastos variados.
        // All obj tiene una fecha(la actual si la ingresan sin especificar)
        // una descripcion y un monto específico
        // y una relacion con el modelo de categorias a través de su Id.
        // INGRESOS
        // Array de ingresos mensuales, aplicado todos los meses
        monthlyInput: [{
                date: { type: Date, default: Date.now() },
                description: String,
                // category: { type: Schema.Types.ObjectId, ref: 'Category' },
                amount: Number
            }],
        extraInput: [{
                date: { type: Date, default: Date.now() },
                description: String,
                // category: { type: Schema.Types.ObjectId, default:"Other", ref: 'Category'},
                amount: Number
            }],
        // GASTOS
        monthlyExpenses: [{
                date: { type: Date, default: Date.now() },
                name: String,
                amount: Number,
                category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
                end: String
            }],
        variableExpenses: [{
                // Gastos adicionales, se aplican a demanda del usuario 
                // es un array de obj con el registro de todos los gastos del mes, se pushea uno nuevo cada mes
                // cada obj tiene la fecha en la que se realizó, su id, su descripcion, category y amount 
                date: { type: Date, default: Date.now() },
                entries: [
                    {
                        id: mongoose_1.Schema.Types.ObjectId,
                        // category: { type: Schema.Types.ObjectId, ref: 'Category' },
                        description: String,
                        amount: Number
                    }
                ]
            }]
    }
});
// Andan 
// {
//   "userName": "Bon Jovi",
//   "lastName": "Jovi",
//   "email": "bon@jovito",
//   "avatar": "jovitoPic",
//   "Account": {
//   "monthlyInput": [{
//     "date": "",
//     "description": "Ta caro el gym",
//     "category": "",
//     "amount": 5000 }]
//   }
// }
exports.default = (0, mongoose_1.model)('UserNoSql-temp', UserSQLessSchema);
