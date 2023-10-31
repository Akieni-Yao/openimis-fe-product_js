import React, {useEffect, useState, useRef} from "react";
import { Tab, Tabs, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withTheme, withStyles } from "@material-ui/styles";
import { useTranslations, combine } from "@openimis/fe-core";
import ItemsTabForm from "./ItemsTabForm";
import ContributionTabForm from "./ContributionTabForm";
import PoolingManagementTabForm from "./PoolingManagementTabForm";
import ServicesTabForm from "./ServicesTabForm";
import DeductiblesCeilingsTabForm from "./DeductiblesCeilingsTabForm";
import {useLimitDefaultsQuery} from "../../hooks";
import {LIMIT_TYPES, PRICE_ORIGINS} from "../../constants";

const useStyles = makeStyles((theme) => ({
  selectedTab: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
    marginTop:"10px",
    fontWeight:600
  },
}));

const CurrentTab = (props) => {
  const { tab } = props;

  switch (tab) {
    case "contributions":
      return <ContributionTabForm {...props} />;
    case "items":
      return <ItemsTabForm {...props} />;
    case "services":
      return <ServicesTabForm {...props} />;
    case "deductibles":
      return <DeductiblesCeilingsTabForm {...props} />;
    case "pooling":
      return <PoolingManagementTabForm {...props} />;
  }
  return null;
};

const TabsForm = (props) => {
  const { classes, ...otherProps } = props;
  const tabClasses = useStyles(); // Access the CSS classes
  const [activeTab, setActiveTab] = useState("contributions");
  const handleChange = (_, value) => setActiveTab(value);
  const { formatMessage } = useTranslations("product.TabsForm");
  const { isLoadingLimitDefaults, dataLimitDefaults} = useLimitDefaultsQuery({skip: true});
  const [isLoadedLimitDefaults, setLoadedLimitDefaults] = useState(false);
  const [limitType, setLimitType] = useState('C');
  const [coInsuranceDefaultValue, setCoInsuranceDefaultValue] = useState(100);
  const [fixedDefaultValue, setFixedDefaultValue] = useState(0);
  const [priceOrigin, setPriceOrigin] = useState('P')

  useEffect(() => {
    if (!isLoadingLimitDefaults && !isLoadedLimitDefaults) {
      setPriceOrigin(dataLimitDefaults.limitDefaults.priceOrigin?? 'P')
      setLimitType(dataLimitDefaults.limitDefaults.limitType?? 'C')
      setCoInsuranceDefaultValue(dataLimitDefaults.limitDefaults.defaultLimitCoInsuranceValue?? 100)
      setFixedDefaultValue(dataLimitDefaults.limitDefaults.defaultLimitFixedValue?? 0)
      setLoadedLimitDefaults(true)
    }
  }, [dataLimitDefaults, isLoadingLimitDefaults]);

  const getLimitValueSwitch = (limitType) => {
      if (limitType === 'F' || limitType === LIMIT_TYPES.F) {
        return fixedDefaultValue;
      }
      else {
        return coInsuranceDefaultValue;
    }
  }

  return isLoadedLimitDefaults && (
    <Paper className={classes.paper}>
      <Tabs TabIndicatorProps={{style: {borderBottom:'4px solid #FFFFFF'}}} className={classes.header} value={activeTab} indicatorColor="primary" onChange={handleChange}>
        <Tab value="contributions" label={formatMessage("contributionPlan")} className={activeTab === "contributions" ? tabClasses.selectedTab : ""}></Tab>
        <Tab value="items" label={formatMessage("productItems")} className={activeTab === "items" ? tabClasses.selectedTab : ""}></Tab>
        <Tab value="services" label={formatMessage("productServices")} className={activeTab === "services" ? tabClasses.selectedTab : ""}></Tab>
        <Tab value="deductibles" label={formatMessage("deductibles")} className={activeTab === "deductibles" ? tabClasses.selectedTab : ""}></Tab>
        <Tab value="pooling" label={formatMessage("pooling")} className={activeTab === "pooling" ? tabClasses.selectedTab : ""}></Tab>
      </Tabs>
      <CurrentTab
        tab={activeTab}
        limitType={limitType}
        getLimitValueSwitch={getLimitValueSwitch}
        priceOrigin={priceOrigin}
        {...otherProps} />
    </Paper>
  );
};

const styles = (theme) => ({
  paper: theme.paper.paper,
  header: theme.paper.header,
});

const enhance = combine(withTheme, withStyles(styles));
export default enhance(TabsForm);
