import { useState } from "react";
import { diff } from "deep-diff";
import PropTypes from 'prop-types';

function Card({ children }) {
  return <div className="border rounded-lg shadow-sm p-4 bg-white">{children}</div>;
}

function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

function Textarea({ value, onChange, rows }) {
  return (
    <textarea
      className="w-full p-2 border rounded-lg"
      value={value}
      onChange={onChange}
      rows={rows}
    ></textarea>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg" onClick={onClick}>
      {children}
    </button>
  );
}

export default function JsonDiffTool() {
  const [json1, setJson1] = useState("{}");
  const [json2, setJson2] = useState("{}");
  const [diffResult, setDiffResult] = useState(null);

  const compareJson = () => {
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      const differences = diff(obj1, obj2);
      setDiffResult(differences ? JSON.stringify(differences, null, 2) : "No differences found");
    } catch {
      setDiffResult("Invalid JSON format");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">JSON Diff Tool</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Original JSON</h3>
            <Textarea value={json1} onChange={(e) => setJson1(e.target.value)} rows={10} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="font-semibold mb-2">Modified JSON</h3>
            <Textarea value={json2} onChange={(e) => setJson2(e.target.value)} rows={10} />
          </CardContent>
        </Card>
      </div>
      <Button onClick={compareJson}>Compare JSON</Button>
      <Card className="mt-4">
        <CardContent>
          <h3 className="font-semibold mb-2">Differences</h3>
          <pre className="p-2 border rounded bg-gray-50 overflow-auto">{diffResult}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

Textarea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rows: PropTypes.number.isRequired,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};
