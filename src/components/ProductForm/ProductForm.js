import React from "react";

import { Form } from "@openimis/fe-core";
import MainPanelForm from "./MainPanelForm";
import TabsForm from "./TabsForm";
import ReplayIcon from "@material-ui/icons/Replay";

const ProductForm = (props) => {
  const { readOnly, onBack, onSave, product, canSave, onReset, onChange, autoFocus, isDuplicate } = props;
  const returnMethodOrReadOnly = (method) => readOnly? !readOnly: method;

  return (
    <Form
      module="product"
      title={product?.uuid ? "product.ProductForm.title" : "product.ProductForm.emptyTitle"}
      titleParams={{ label: product.name ?? "" }}
      readOnly={readOnly}
      canSave={returnMethodOrReadOnly(canSave)}
      onEditedChanged={onChange}
      edited={product}
      isDuplicate={isDuplicate}
      edited_id={product.uuid}
      HeadPanel={MainPanelForm}
      Panels={[TabsForm]}
      save={returnMethodOrReadOnly(onSave)}
      autoFocus={autoFocus}
      back={onBack}
      openDirty={returnMethodOrReadOnly(onSave)}
      actions={[
        {
          doIt: onReset,
          icon: <ReplayIcon />,
          onlyIfDirty: !readOnly,
        },
      ]}
    />
  );
};
export default ProductForm;
