import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

export const initObscenityService = () => ({
  censor: new TextCensor(),
  matcher: new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  }),
});

export type ObscenityService = ReturnType<typeof initObscenityService>;
