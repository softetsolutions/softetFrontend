import React from "react";
import PropTypes from "prop-types";

const IFramePreview = React.memo(({src, title})=>{
    return(
        <div className="h-full flex flex-col">
                    <div className="p-3 pt-5 border-b bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                      <h3 className="text-sm font-medium text-gray-600">
                        {title}
                      </h3>
                    </div>
                    <iframe
                      srcDoc={src}
                      className="flex-1 w-full bg-white"
                      sandbox="allow-scripts allow-modals"
                      title={title}
                    />
                  </div>
    )
})
IFramePreview.displayName = "IFramePreview";

IFramePreview.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default IFramePreview;