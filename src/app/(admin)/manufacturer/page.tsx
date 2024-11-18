// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';
// import React, { useState } from 'react';

// function ProductionForm() {
//     const [materialType, setMaterialType] = useState('');
//     const [inputWeight, setInputWeight] = useState('');
//     const [outputs, setOutputs] = useState([{ name: '', ratio: 0, weight: '' }]);

//     const handleMaterialChange = (e: any) => {
//         const value = e.target.value;
//         setMaterialType(value);
//         if (value === 'ngô') {
//             setOutputs([{ name: 'Bột ngô', ratio: 100, weight: inputWeight }]);
//         } else {
//             setOutputs([{ name: '', ratio: '', weight: '' }]);
//         }
//     };

//     const handleOutputChange = (index: any, field: any, value: any) => {
//         const newOutputs = [...outputs];
//         newOutputs[index][field] = value;

//         // Tự động tính khối lượng
//         if (field === 'ratio') {
//             newOutputs[index].weight = ((value / 100) * inputWeight).toFixed(2);
//         }
//         setOutputs(newOutputs);
//     };

//     const addOutput = () => {
//         setOutputs([...outputs, { name: '', ratio: '', weight: '' }]);
//     };

//     const removeOutput = (index: any) => {
//         setOutputs(outputs.filter((_, i) => i !== index));
//     };

//     return (
//         <div className="production-form">
//             <h1 className="text-lg font-bold">Tạo phiếu sản xuất</h1>

//             <div className="mb-4">
//                 <label>Loại nguyên liệu:</label>
//                 <select
//                     value={materialType}
//                     onChange={handleMaterialChange}
//                     className="border p-2"
//                 >
//                     <option value="">-- Chọn --</option>
//                     <option value="thóc">Thóc</option>
//                     <option value="ngô">Ngô</option>
//                 </select>
//             </div>

//             <div className="mb-4">
//                 <label>Khối lượng đầu vào (tấn):</label>
//                 <input
//                     type="number"
//                     value={inputWeight}
//                     onChange={(e) => setInputWeight(e.target.value)}
//                     className="border p-2 w-full"
//                 />
//             </div>

//             {materialType === 'ngô' && (
//                 <div className="mb-4">
//                     <label>Sản phẩm đầu ra:</label>
//                     <p>Bột ngô: {inputWeight} tấn</p>
//                 </div>
//             )}

//             {materialType === 'thóc' && (
//                 <div className="mb-4">
//                     <label>Sản phẩm đầu ra:</label>
//                     <table className="border-collapse border border-gray-300 w-full">
//                         <thead>
//                             <tr>
//                                 <th className="border p-2">Tên sản phẩm</th>
//                                 <th className="border p-2">Tỷ lệ (%)</th>
//                                 <th className="border p-2">Khối lượng (tấn)</th>
//                                 <th className="border p-2">Hành động</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {outputs.map((output, index) => (
//                                 <tr key={index}>
//                                     <td className="border p-2">
//                                         <input
//                                             type="text"
//                                             value={output.name}
//                                             onChange={(e) =>
//                                                 handleOutputChange(index, 'name', e.target.value)
//                                             }
//                                             className="border p-2"
//                                         />
//                                     </td>
//                                     <td className="border p-2">
//                                         <input
//                                             type="number"
//                                             value={output.ratio}
//                                             onChange={(e) =>
//                                                 handleOutputChange(index, 'ratio', e.target.value)
//                                             }
//                                             className="border p-2"
//                                         />
//                                     </td>
//                                     <td className="border p-2">{output.weight || '0'} tấn</td>
//                                     <td className="border p-2">
//                                         <button
//                                             onClick={() => removeOutput(index)}
//                                             className="bg-red-500 text-white p-1 rounded"
//                                         >
//                                             Xóa
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                     <button
//                         onClick={addOutput}
//                         className="bg-blue-500 text-white p-2 mt-2 rounded"
//                     >
//                         Thêm sản phẩm
//                     </button>
//                 </div>
//             )}

//             <button className="bg-green-500 text-white p-3 rounded">Lưu phiếu</button>
//         </div>
//     );
// }

// export default ProductionForm;
