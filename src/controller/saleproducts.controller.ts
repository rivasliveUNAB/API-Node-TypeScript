import { Request, Response } from 'express'
// DB
import { connect } from '../database'
// Interfaces
import { Categories } from '../interfaces/Categories';
import { SaleProducts } from '../interfaces/SaleProducts'

export async function listSaleProducts(req: Request, res: Response): Promise<Response | void> {
    try {
        const conn = await connect();
        const query: string = 'SELECT * from SaleProducts JOIN Categories ON SaleProducts.idCategory = Categories.idCategoria where stateCategory != 0 and stateSaleProduct != 0';
        const call = await conn.query(query);
        let saleProducts: any[] = JSON.parse(JSON.stringify(call[0]));
        const saleProductsCategory = saleProducts.map(saleProduct =>{
            const saleProductFormated: SaleProducts = {
                idSaleProduct: saleProduct.idSaleProduct,
                nameProduct: saleProduct.nameProduct,
                price: saleProduct.price,
                idCategory: {
                    idCategory: saleProduct.idCategory,
                    nameCategory: saleProduct.nameCategory,
                    stateCategory: saleProduct.stateCategory
                },
                stateSaleProduct: saleProduct.stateProduct
            };
            return saleProductFormated;
        })
        res.json(saleProductsCategory);
    }
    catch (e: any) {
        res.status(500).json({
            message: "Internal server error",
            code: 500,
            errors: e?.response?.data || e?.message || null,
            data: null,
        });
    } 
}