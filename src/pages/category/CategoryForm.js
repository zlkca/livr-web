
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";


import { selectCategory } from "../../redux/category/category.selector";
import { setCategory } from "../../redux/category/category.slice";
import { setSignedInUser } from "../../redux/auth/auth.slice";
import { setSnackbar } from "../../redux/ui/ui.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import MDBox from "components/MDBox";
import CardHead from "components/CardHead";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Footer from "layouts/Footer";
import { categoryAPI } from "../../services/categoryAPI";

export default function CategoryFormPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
  
    const [error, setError] = useState({});
    const [data, setData] = useState();
  
    const signedInUser = useSelector(selectSignedInUser);
    const category = useSelector(selectCategory);
  
    useEffect(() => {
      if (category) {
        setData({ ...category });
      } else {
        if (params && params.id && params.id !== "new") {
          if (!category) {
            // refetch if page refreshed
            categoryAPI.fetchCategory(params.id).then((r) => {
              if (r.status === 200) {
                setData({ ...r.data });
              }
            });
          }
        }
      }
    }, [category]);
  
    
    const validate = (d) => {
        
            if (!d.name) {
                alert(t("Name is required"));
                return false;
            }
            
            if (!d.description) {
                alert(t("Description is required"));
                return false;
            }
            
            if (!d.status) {
                alert(t("Status is required"));
                return false;
            }
            
            if (!d.creator) {
                alert(t("Creator is required"));
                return false;
            }
            
        return true;
    };
    
    
          const handleNameChange = (event) => {
              const a = { ...data, name: event.target.value };
              setData(a);
          };
    
          const handleDescriptionChange = (event) => {
              const a = { ...data, description: event.target.value };
              setData(a);
          };
    
          const handleStatusChange = (event) => {
              const a = { ...data, status: event.target.value };
              setData(a);
          };
  
    const handleSubmit = () => {
      const d = {
        ...data,
        creator: {
          _id: signedInUser._id,
          username: signedInUser.username,
        },
      };
  
      if(!validate(d)) return;
  
      if (d._id) {
        categoryAPI.updateCategory(d._id, d).then((r) => {
          if (r.status === 200) {
            dispatch(setCategory(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Updated Successfully!"),
                open: true,
              })
            );
            navigate("/categories");
          }
        });
      } else {
        categoryAPI
          .createCategory({
            ...d
          })
          .then((r) => {
            if (r.status === 200) {
              dispatch(setCategory(r.data));
              dispatch(
                setSnackbar({
                  color: "success",
                  icon: "check",
                  title: "",
                  content: t("Created Successfully!"),
                  open: true,
                })
              );
              navigate("/categories");
            }
          });
      }
    };
  
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={1} pb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHead title={data && data._id ? t("Edit Project") : t("Create Project")} />
  
                <MDSection title={t("Basic Info")}>
                  <Grid container xs={12} display="flex" pt={1} spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <MDTypography variant="button" fontWeight="regular" color="text">
                      </MDTypography>
                    </Grid>
                  </Grid>
                  
            <Grid container xs={12} display="flex" pt={2} spacing={2}>
                <Grid item xs={6} sm={3}>
                    <MDInput
                        label={t("name")}
                        value={data && data.name ? data.name : ""}
                        onChange={handleNameChange}
                        helperText={error && error.name ? error.name : ""}
                    />
                </Grid>
            </Grid>
            
            <Grid container xs={12} display="flex" pt={2} spacing={2}>
                <Grid item xs={6} sm={3}>
                    <MDInput
                        label={t("description")}
                        value={data && data.description ? data.description : ""}
                        onChange={handleDescriptionChange}
                        helperText={error && error.description ? error.description : ""}
                    />
                </Grid>
            </Grid>
            
            <Grid container xs={12} display="flex" pt={2} spacing={2}>
                <Grid item xs={6} sm={3}>
                    <MDInput
                        label={t("status")}
                        value={data && data.status ? data.status : ""}
                        onChange={handleStatusChange}
                        helperText={error && error.status ? error.status : ""}
                    />
                </Grid>
            </Grid>
            
                </MDSection>
  
                <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                  <MDButton
                    color="secondary"
                    variant="outlined"
                    style={{ marginRight: 20 + "px" }}
                    onClick={() => navigate(-1)}
                  >
                    {t("Cancel")}
                  </MDButton>
                  <MDButton variant="gradient" color="info" onClick={handleSubmit}>
                    {t("Save")}
                  </MDButton>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }
