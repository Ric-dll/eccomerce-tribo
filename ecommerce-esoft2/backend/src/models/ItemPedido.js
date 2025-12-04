import { Model, DataTypes } from 'sequelize';

class ItemPedido extends Model {
    static init(sequelize) {
        super.init({
            ID_item: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // Guarda o preço no momento da compra
            PrecoUnitario: { 
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            }
            // Pedido_ID (FK) e Produto_ID (FK) serão definidos no db.js
        }, {
            sequelize,
            modelName: 'ItemPedido',
            tableName: 'ItemPedido'
        });
        return this;
    }
}
export default ItemPedido;