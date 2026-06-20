import { HttpExceptionBody } from "@nestjs/common";

export class YoutubeVideoId {
  private constructor(private readonly value: string) {}

  private static readonly URL_REGEX =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;

  static create(url: string): YoutubeVideoId | HttpExceptionBody {
    const match = url.match(this.URL_REGEX);

    if (!match) {
      return { statusCode: 400, message: 'Invalid Youtube URL' };
    }

    return new YoutubeVideoId(match[1]);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: YoutubeVideoId): boolean {
    return this.value === other.value;
  }
}