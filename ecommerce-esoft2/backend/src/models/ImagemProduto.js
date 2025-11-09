// backend/src/models/ImagemProduto.js
import { Model, DataTypes } from 'sequelize';

class ImagemProduto extends Model {
    static init(sequelize) {
        super.init({
            ID_imagem: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            URL: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            Ordem: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
            // Produto_ID (FK) é adicionado no db.js
        }, {
            sequelize,
            modelName: 'ImagemProduto',
            tableName: 'ImagemProduto'
        });
        return this;
    }
}
export default ImagemProduto;