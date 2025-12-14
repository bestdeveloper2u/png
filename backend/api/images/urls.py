from django.urls import path
from api.images.views.single_image import SingleImageView
from api.images.views.download import DownloadImageViewSet, AllImageDownloadCountViewSet, AllImageContributorDownloadCountViewSet
from api.images.views.approved import ApprovedImagesViewSet, ApprovedImagesLenghtView, UserApprovedImagesViewSet, UserApprovedImagesLengthView
from api.images.views.total import TotalImagesViewSet, TotalImagesLenghtView, UserTotalImagesViewSet, UserTotalImagesLengthView
from api.images.views.pending import PendingImagesViewSet, PendingImagesLenghtView, UserPendingImagesViewSet, UserPendingImagesLengthView
from api.images.views.rejected import RejectedImagesViewSet, RejectedImagesLenghtView, UserRejectedImagesViewSet, UserRejectedImagesLengthView
from api.images.views.deleted import SingleImageDeleteView, NumberOfImageDeleteView, ALLImageDeleteView
from api.images.views.updated import SingleImageUpdateView, SelectedImageUpdateView
from api.images.views.categories import CategoriesViewSet
from api.images.views.sub_categories import SubCategoriesViewSet
from api.images.views.keywords import KeywordsView
from api.images.views.upload import ImagesUploadAPIView

urlpatterns = [
    # IMAGE UPLOAD ROUTE
    path(
        "upload/", 
        ImagesUploadAPIView.as_view(),
        name="upload_images"
    ),

    # CATEGORIES ALL ROUTES 
    path(
        "categories/", 
        CategoriesViewSet.as_view({"get": "list", "post": "create"}), 
        name="categories_list_create",
    ),
    path(
        "categories/<int:pk>/", 
        CategoriesViewSet.as_view({
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }), 
        name="categories_admin",
    ),
    path(
        "categories/<slug:slug>/",
        CategoriesViewSet.as_view({"get": "retrieve"}),
        name="categories_detail_slug",
    ),

    # SUB CATEGORIES ALL ROUTES
    path(
        "sub-categories/",
        SubCategoriesViewSet.as_view({"get": "list", "post": "create"}),
        name="sub_categories_list_create",
    ),
    path(
        "sub-categories/<int:pk>/",
        SubCategoriesViewSet.as_view({
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="sub_categories_admin",
    ),
    path(
        "sub-categories/<str:slug>/",
        SubCategoriesViewSet.as_view({"get": "retrieve"}),
        name="sub_categories_detail_slug",
    ),

    # TOTAL IMAGES ALL ROUTES
    path(
        'total/',
        TotalImagesViewSet.as_view({ 'get': 'list' }),
        name='total_images'
    ),
    path(
        'total-images-length/',
        TotalImagesLenghtView.as_view({ 'get' : 'list' }),
        name='total_images_lenght',
    ),
    path(
        'user/total/',
        UserTotalImagesViewSet.as_view({ 'get': 'list' }),
        name='user_total_images'
    ),
    path(
        'user/total-images-length/',
        UserTotalImagesLengthView.as_view({ 'get' : 'list' }),
        name='total_images_lenght',
    ),

    # PENDING IMAGES ALL ROUTES
    path(
        'pending/',
        PendingImagesViewSet.as_view({ 'get' : 'list' }),
        name='pending_images'
    ),
    path(
        'pending-images-length/',
        PendingImagesLenghtView.as_view({ 'get' : 'list' }),
        name='pending_images_lenght',
    ),
    path(
        'user/pending/',
        UserPendingImagesViewSet.as_view({ 'get' : 'list' }),
        name='pending_images'
    ),
    path(
        'user/pending-images-length/',
        UserPendingImagesLengthView.as_view({ 'get' : 'list' }),
        name='pending_images_lenght',
    ),

    # APPROVED IMAGES ALL ROUTES
    path(
        'approved/',
        ApprovedImagesViewSet.as_view({ 'get' : 'list' }),
        name='approved_images'
    ),
    path(
        'user/approved/',
        UserApprovedImagesViewSet.as_view({ 'get' : 'list' }),
        name='approved_images'
    ),
    path(
        'approved-images-length/',
        ApprovedImagesLenghtView.as_view({ 'get' : 'list' }),
        name='approved_images_lenght',
    ),
    path(
        'user/approved-images-length/',
        UserApprovedImagesLengthView.as_view({ 'get' : 'list' }),
        name='approved_images_lenght',
    ),

    # REJECTED IMAGES ALL ROUTES
    path(
        'rejected/',
        RejectedImagesViewSet.as_view({ 'get' : 'list' }),
        name='rejected_images'
    ),
    path(
        'rejected-images-length/',
        RejectedImagesLenghtView.as_view({ 'get' : 'list' }),
        name='rejected_images_lenght',
    ),
    path(
        'user/rejected/',
        UserRejectedImagesViewSet.as_view({ 'get' : 'list' }),
        name='rejected_images'
    ),
    path(
        'user/rejected-images-length/',
        UserRejectedImagesLengthView.as_view({ 'get' : 'list' }),
        name='rejected_images_lenght',
    ),

    # IMAGE DOWNLOAD ROUTE
    path(
        'all-download/',
        AllImageDownloadCountViewSet.as_view({'get': 'list'}),
        name='all_download_image'
    ),
    path(
        'all-contributor-download/',
        AllImageContributorDownloadCountViewSet.as_view({'get': 'list'}),
        name='all_contributor_download',
    ),

    # KEYWORDS ALL ROUTES
    path(
        'keywords/',
        KeywordsView.as_view(),
        name='keywords',
    ),

    # IMAGES UPDATED
    path(
        'update/<int:pk>/',
        SingleImageUpdateView.as_view({'put': 'update'}),
        name='single_imageUpdate',
    ),
    path(
        'bulk-update/',
        SelectedImageUpdateView.as_view({'put': 'update'}),
        name='bulk-image-update',
    ),

    # IMAGES DELETED ALL ROUTES
    path(
        'delete-all/',
        ALLImageDeleteView.as_view({'delete': 'destroy'}),
        name='all_image_delete',
    ),
    path(
        'deletes/',
        NumberOfImageDeleteView.as_view(),
        name='number_of_image_delete',
    ),
    path(
        'delete/<int:pk>/',
        SingleImageDeleteView.as_view({'delete': 'destroy'}),
        name='single_image_delete',
    ),

    # SINGLE IMAGE ALL ROUTES
    path(
        "<str:slug>/",
        SingleImageView.as_view({"get": "retrieve"}),
        name="single_image_detail",
    ),

    # IMAGE DOWNLOAD ROUTE
    path(
        "download/<str:pk>/",
        DownloadImageViewSet.as_view({"get": "retrieve"}),
        name='download_image',
    ),
    
]

