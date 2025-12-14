from rest_framework import serializers
from images.models import Images, Keywords

class KeywordSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Keywords
        fields = ['id', 'name']

class UpdatedImageSerializer(serializers.ModelSerializer):
    keywords = KeywordSerializer(many=True, required=False)

    class Meta:
        model = Images
        fields = '__all__'

    def update(self, instance, validated_data):
        keywords_data = validated_data.pop('keywords', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if keywords_data is not None:
            existing_keywords = {kw.id: kw for kw in instance.keywords.all()}
            updated_keyword_ids = []

            for kw_data in keywords_data:
                kw_id = kw_data.get('id')
                kw_name = kw_data.get('name')

                if kw_id and kw_id in existing_keywords:
                    kw_obj = existing_keywords[kw_id]
                    kw_obj.name = kw_name
                    kw_obj.save()
                    updated_keyword_ids.append(kw_obj.id)
                else:
                    kw_obj = Keywords.objects.create(name=kw_name)
                    instance.keywords.add(kw_obj)
                    updated_keyword_ids.append(kw_obj.id)
                    
            for kw in instance.keywords.all():
                if kw.id not in updated_keyword_ids:
                    kw.delete()

        return instance
