import { Inventory } from '../../../../../src/domain/entities/inventory.entity';
import { Product } from '../../../../domain/entities/itens/product.entity';
import { ClientSession, Collection, Filter, FindOptions, ObjectId } from 'mongodb';
import { iInventoryRepository } from '../../contracts/repositorys/iInventoryRepository';
import { iListProducts } from '../../../../../src/domain/usecases/inventories/products/iListProducts.usecase';

export class InventoryRepository implements iInventoryRepository {

  constructor(
    private SessionDB : ClientSession,
    private InventoryColletion : Collection<Inventory>,
  ) {}

  async updateInventory(inventory: Inventory): Promise<Inventory> {
    if (!inventory || !inventory.id) return;

    const currentInventory = await this.findById(inventory.id);

    const updatedInventory = new Inventory({
      ...currentInventory,
      products: currentInventory.products,
      updated_at: new Date(),
    });

    const result = await this.InventoryColletion.updateOne(
      { id: currentInventory.id },
      updatedInventory
    );
    if (result.modifiedCount) {
      return updatedInventory;
    }
  }

  finByCompanyId(company_id: string): Promise<Inventory> {
    return this.InventoryColletion.findOne({ company_id });
  }

  findById(_id: string): Promise<Inventory> {
    return this.InventoryColletion.findOne({ id: _id });
  }

  async createInventory(inventory: Inventory): Promise<{ _id: string }> {
    const result = await this.InventoryColletion.insertOne({
      ...inventory,
      _id: new ObjectId().toHexString() as any,
    });

    return { _id: result.insertedId.toString() };
  }

  async insertProducts(
    inventoryId: string,
    newProducts: Array<Product>
  ): Promise<Array<Product>> {
    if (!newProducts || !newProducts.length) return;

    const products = newProducts.map((product) => {
      return {
        ...product,
        _id: new ObjectId().toString(),
      };
    });

    const result = await this.InventoryColletion.updateOne(
      { id: inventoryId },
      {
        $push: { products: { $each: products } },
      }
    );

    if (result.matchedCount) {
      return products;
    }
  }

  async listProducts(companyId: string, filters?: iListProducts.Filters): Promise<Product[]> {
    const configQuery = {
      limit : filters.limit || 25,
      skip : filters.offset || 0
    }
    
    const findOptions : FindOptions = {
      projection : {
        products : { $slice : ['$products', configQuery.skip, configQuery.limit]}
      }
    }

    const where: Filter<Product> = {
      company_id: companyId,
    };

    if (filters) {
      if (filters.productId) {
        findOptions.projection = {
          products : {
            $filter : {
              input : "$products",
              cond : { $eq : ["$$product._id", filters.productId] },
              as : "product"
            }
          }
        }
      }
    }

    const inventory = await this.InventoryColletion.findOne({...where as any}, findOptions)
    return inventory?.products ?? []
  }
}
