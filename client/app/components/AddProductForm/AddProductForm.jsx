import { Form } from '@remix-run/react';

export const AddProductForm = ({ errors }) => {
  return (
    <Form className="max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            className={`w-full bg-gray-100 border ${
              errors?.name ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded-lg focus:outline-none focus:bg-white`}
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors?.name.message}</p>
          )}
        </div>
        <div className="form-control">
          <label
            htmlFor="category"
            className="block text-gray-700 font-bold mb-2"
          >
            Category
          </label>
          <select
            id="category"
            className={`w-full bg-gray-100 border ${
              errors?.category ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded-lg focus:outline-none focus:bg-white`}
          >
            <option value="">-- Select category --</option>
            <option value="WALLET">Wallet</option>
            <option value="BELT">Belt</option>
            <option value="BRACELET">Bracelet</option>
            <option value="GLASSES">Glasses</option>
          </select>
          {errors?.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors?.category.message}
            </p>
          )}
        </div>
      </div>
      <div className="form-control">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          className={`w-full bg-gray-100 border ${
            errors?.description ? 'border-red-500' : 'border-gray-300'
          } p-2 rounded-lg focus:outline-none focus:bg-white`}
        ></textarea>
        {errors?.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors?.description.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
            Price
          </label>
          <input
            type="number"
            id="price"
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg focus:outline-none focus:bg-white"
          />
        </div>
        <div className="form-control">
          <label
            htmlFor="status"
            className="block text-gray-700 font-bold mb-2"
          >
            Status
          </label>
          <select
            id="status"
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg focus:outline-none focus:bg-white"
          >
            <option value="">-- Select status --</option>
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
          </select>
        </div>
      </div>
      <div className="form-control">
        <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
          Images (comma separated URLs)
        </label>
        <input
          type="text"
          id="images"
          className="w-full bg-gray-100 border border-gray-300 p-2 rounded-lg focus:outline-none focus:bg-white"
        />
      </div>
    </Form>
  );
};

export default AddProductForm;
