import { Model, DataTypes } from 'sequelize';

class ItemCarrinho extends Model {
    static init(sequelize) {
        super.init({
            // Chave Primária Composta
            ID_carrinho: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Carrinho',
                    key: 'ID_carrinho'
                }
            },
            Produto_ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Produto',
                    key: 'ID_produto'
                }
            },
            Quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        }, {
            sequelize,
            modelName: 'ItemCarrinho',
            tableName: 'ItemCarrinho'
        });
        return this;
    }
}
export default ItemCarrinho;