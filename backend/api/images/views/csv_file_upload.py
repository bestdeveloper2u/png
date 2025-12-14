import csv
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from permissions.or_permission import IsRegularOrAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from images.models import Images, Keywords

class CSVFileView(APIView):
    permission_classes = [IsRegularOrAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES.get('file') 
        if not csv_file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            csv_data = csv.DictReader(csv_file.read().decode('utf-8').splitlines())
            updated_count = 0

            for row in csv_data:
                name = row.get('Filename').strip()
                title = row.get('Title')
                category = row.get('Category')
                keywords = row.get('Keywords')

                try:
                    image = Images.objects.get(name__iexact=name)
                    image.title = title
                    image.category = category
                    keyword_list = keywords.split(', ')
                    for keyword in keyword_list:
                        Keywords.objects.update_or_create(
                            image=image,
                            name=keyword.strip(),
                        )

                    image.save()
                    updated_count += 1

                except Images.DoesNotExist:
                    print(f"No image found with name: {name}")
                    continue

            return Response({
                'success': True,
                'message': f'{updated_count} images updated successfully.',
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
