import urlMetadata from 'url-metadata';

export default async function getMetadados(link) {
  return urlMetadata(link);
}
