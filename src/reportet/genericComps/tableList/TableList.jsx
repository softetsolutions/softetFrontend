import "./tableList.css";
import { useState } from "react";

const TableList = ({ list }) => {
  const [showCompleteList, setShowCompleteList] = useState(false);

  return (
    <div className="tableList">
      {list?.length && <span className="chip">{list[0]}</span>}
      {list?.length > 1 && (
        <span
          className="more"
          onMouseEnter={() => setShowCompleteList(true)}
          onMouseLeave={() => setShowCompleteList(false)}
        >
          +{list?.length - 1} more
        </span>
      )}
      {showCompleteList && (
        <div className="listContainer bg-blue-200 text-blue-800 font-semibold p-2">
          {list?.slice(1, list.length)?.map((item, index) => (
            <div key={`${item}_${index}`}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableList;
