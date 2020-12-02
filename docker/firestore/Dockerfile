FROM google/cloud-sdk:290.0.1
RUN apt-get install google-cloud-sdk-firestore-emulator
CMD [ "gcloud", "beta", "emulators", "firestore", "start", "--host-port=0.0.0.0:8505" ]
EXPOSE 8505
