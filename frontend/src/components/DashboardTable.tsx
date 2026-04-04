const DashboardTable = ({ title, headers, data }: any) => (
  <div className="bg-[#0d1117]/90 border border-[#1a1f2a] rounded-2xl p-5 shadow-xl">
    <h3 className="text-white font-semibold mb-4">{title}</h3>

    <table className="w-full text-sm text-left">
      <thead>
        <tr className="text-gray-500 border-b border-[#1f2733]">
          {headers.map((h: string, i: number) => (
            <th key={i} className="pb-2">{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row: any, i: number) => (
          <tr key={i} className="border-b border-[#1f2733] last:border-none">
            {row.map((cell: any, j: number) => (
              <td key={j} className="py-2 text-gray-300">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DashboardTable;